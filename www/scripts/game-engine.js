/**
 * 游戏引擎 - 核心游戏逻辑控制器
 */

export class GameEngine {
    constructor(dataManager, uiController, timeSystem, examSystem, socialSystem, eventSystem, aiSystem) {
        this.dataManager = dataManager;
        this.uiController = uiController;
        this.timeSystem = timeSystem;
        this.examSystem = examSystem;
        this.socialSystem = socialSystem;
        this.eventSystem = eventSystem;
        this.aiSystem = aiSystem;
        
        this.player = null;
        this.isRunning = false;
        this.speed = 1;
        this.lastTick = 0;
        this.tickInterval = null;
        
        this.callbacks = {
            onTick: [],
            onDayChange: [],
            onWeekChange: [],
            onMonthChange: [],
            onSemesterChange: [],
            onExamStart: [],
            onEvent: []
        };
    }

    setPlayer(player) {
        this.player = player;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTick = Date.now();
        this.gameLoop();
        
        console.log('🎮 游戏引擎启动');
    }

    pause() {
        this.isRunning = false;
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
        console.log('⏸️ 游戏暂停');
    }

    resume() {
        if (!this.isRunning) {
            this.start();
        }
        console.log('▶️ 游戏继续');
    }

    setSpeed(speed) {
        this.speed = Math.max(1, Math.min(16, speed));
        console.log(`⚡ 游戏速度: ${this.speed}x`);
        
        if (this.player && this.player.type === 'student') {
            this.updateTimeDisplay();
        }
    }

    gameLoop() {
        if (!this.isRunning) return;

        const now = Date.now();
        const deltaTime = (now - this.lastTick) * this.speed;
        this.lastTick = now;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        const previousDate = { ...this.timeSystem.getCurrentDate() };
        
        this.timeSystem.tick(deltaTime);
        
        const currentDate = this.timeSystem.getCurrentDate();
        
        if (previousDate.day !== currentDate.day) {
            this.onDayChange();
        }
        
        if (previousDate.week !== currentDate.week) {
            this.onWeekChange();
        }
        
        if (previousDate.month !== currentDate.month) {
            this.onMonthChange();
        }
        
        if (previousDate.semester !== currentDate.semester) {
            this.onSemesterChange();
        }

        this.aiSystem.update(deltaTime);
        this.eventSystem.update(deltaTime);
        
        this.triggerCallback('onTick', deltaTime);
    }

    render() {
        if (this.player) {
            this.updateTimeDisplay();
            this.updatePlayerStatus();
        }
    }

    updateTimeDisplay() {
        const date = this.timeSystem.getCurrentDate();
        
        const semesterEl = document.getElementById('semester-display');
        const dateEl = document.getElementById('date-display');
        const progressEl = document.getElementById('time-progress');

        if (semesterEl) {
            semesterEl.textContent = `${date.year}学年 ${date.semester === 1 ? '第一' : '第二'}学期`;
        }
        
        if (dateEl) {
            const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            dateEl.textContent = `第${date.week}周 ${weekNames[date.dayOfWeek]}`;
        }
        
        if (progressEl) {
            const termProgress = this.timeSystem.getTermProgress();
            progressEl.style.width = `${termProgress}%`;
        }
    }

    updatePlayerStatus() {
        if (!this.player) return;

        if (this.player.type === 'student') {
            const moodEl = document.querySelector('.status-item:nth-child(1) .status-value');
            const energyEl = document.querySelector('.status-item:nth-child(2) .status-value');
            const efficiencyEl = document.querySelector('.status-item:nth-child(3) .status-value');

            if (moodEl) moodEl.textContent = `${this.player.mood || 80}%`;
            if (energyEl) energyEl.textContent = `${this.player.energy || 75}%`;
            if (efficiencyEl) efficiencyEl.textContent = `${this.player.studyEfficiency || 70}%`;
        }
    }

    onDayChange() {
        this.triggerCallback('onDayChange');
        
        if (this.player && this.player.type === 'student') {
            this.player.energy = Math.min(100, (this.player.energy || 75) + 20);
            this.player.mood = Math.min(100, (this.player.mood || 80) + 5);
        }
        
        this.uiController.showToast('新的一天开始了！', 'info');
    }

    onWeekChange() {
        this.triggerCallback('onWeekChange');
        this.aiSystem.weeklyUpdate();
    }

    onMonthChange() {
        this.triggerCallback('onMonthChange');
        this.aiSystem.monthlyUpdate();
    }

    onSemesterChange() {
        this.triggerCallback('onSemesterChange');
        
        if (this.player && this.player.type === 'student') {
            this.checkPromotion();
        }
    }

    checkPromotion() {
        if (this.player.type !== 'student') return;
        
        const currentGrade = this.player.grade;
        const examScore = this.player.getAverageScore();
        
        if (examScore >= 60) {
            this.player.grade++;
            this.uiController.showToast(`恭喜升级到${this.getGradeName(this.player.grade)}！`, 'success');
        }
    }

    getGradeName(grade) {
        const names = {
            7: '初一', 8: '初二', 9: '初三',
            10: '高一', 11: '高二', 12: '高三'
        };
        return names[grade] || `高${grade-9}`;
    }

    initGameData() {
        const gameData = {
            meta: {
                version: '1.0',
                lastSave: Date.now(),
                playTime: 0
            },
            player: this.player.getData(),
            time: this.timeSystem.getData(),
            school: this.initSchoolData(),
            statistics: {
                achievements: [],
                records: []
            }
        };

        this.dataManager.save(gameData);
    }

    initSchoolData() {
        return {
            name: '阳光中学',
            level: 1,
            reputation: 50,
            funds: 1000000,
            departments: [
                { id: 'academic', name: '教务处', efficiency: 80, director: null },
                { id: 'student', name: '政教处', efficiency: 80, director: null },
                { id: 'logistics', name: '总务处', efficiency: 80, director: null },
                { id: 'research', name: '教研室', efficiency: 80, director: null },
                { id: 'office', name: '办公室', efficiency: 80, director: null },
                { id: 'finance', name: '财务处', efficiency: 80, director: null }
            ],
            teachers: [],
            students: []
        };
    }

    loadGameData(data) {
        this.timeSystem.loadData(data.time);
        this.aiSystem.loadData(data);
    }

    getGameData() {
        return {
            meta: {
                version: '1.0',
                lastSave: Date.now(),
                playTime: this.timeSystem.getTotalSeconds()
            },
            player: this.player.getData(),
            time: this.timeSystem.getData(),
            ai: this.aiSystem.getData(),
            statistics: this.getStatistics()
        };
    }

    getStatistics() {
        return {
            achievements: [],
            records: []
        };
    }

    on(callbackType, callback) {
        if (this.callbacks[callbackType]) {
            this.callbacks[callbackType].push(callback);
        }
    }

    off(callbackType, callback) {
        if (this.callbacks[callbackType]) {
            this.callbacks[callbackType] = this.callbacks[callbackType].filter(cb => cb !== callback);
        }
    }

    triggerCallback(callbackType, data) {
        if (this.callbacks[callbackType]) {
            this.callbacks[callbackType].forEach(callback => callback(data));
        }
    }

    getPlayer() {
        return this.player;
    }

    getTimeSystem() {
        return this.timeSystem;
    }

    getAISystem() {
        return this.aiSystem;
    }

    getExamSystem() {
        return this.examSystem;
    }

    startExam(config = {}) {
        const examConfig = {
            subject: config.subject || 'math',
            title: config.title || '单元测试',
            duration: config.duration || 60,
            difficulty: config.difficulty || 'medium',
            count: config.count || 10,
            grade: this.player ? this.player.grade : 7,
            ...config
        };

        const exam = this.examSystem.createExam(examConfig);

        this.uiController.renderExamStart(
            exam,
            this.examSystem,
            () => this.beginExam(exam),
            () => this.skipExam(exam)
        );

        return exam;
    }

    beginExam(exam) {
        const startedExam = this.examSystem.startExam(exam);

        this.uiController.renderExamInterface(
            startedExam,
            this.examSystem,
            (questionId, answer) => {
                this.examSystem.submitAnswer(questionId, answer);
            },
            (index) => {
                this.examSystem.goToQuestion(index);
                this.uiController.updateQuestionDisplay(
                    this.examSystem.getCurrentExam(),
                    this.examSystem,
                    null
                );
            },
            () => this.submitExam()
        );
    }

    skipExam(exam) {
        const baseScore = this.player ? this.player.getAverageScore() : 75;
        const randomFactor = 0.9 + Math.random() * 0.2;
        const estimatedScore = Math.round(baseScore * randomFactor);
        const percentage = Math.min(100, Math.max(0, estimatedScore));
        const grade = this.examSystem.getGrade(percentage);

        const result = {
            totalScore: Math.round((percentage / 100) * exam.totalScore),
            maxScore: exam.totalScore,
            percentage,
            grade,
            details: [],
            sectionScores: exam.sections.map(s => ({
                name: s.name,
                score: Math.round((percentage / 100) * s.totalScore),
                maxScore: s.totalScore,
                percentage
            }))
        };

        this.uiController.renderExamResult(result, exam, this.examSystem);
        this.uiController.showToast(`跳过考试，获得估算成绩：${percentage}%`, 'info');

        if (this.player && this.player.type === 'student') {
            this.player.recordExamResult(exam.subject, result);
        }
    }

    submitExam() {
        const result = this.examSystem.finishExam();

        if (result) {
            this.uiController.renderExamResult(result.result, result.exam, this.examSystem);
            this.uiController.showToast(`考试完成！得分：${result.result.totalScore}分`, 'success');

            if (this.player && this.player.type === 'student') {
                this.player.recordExamResult(result.exam.subject, result.result);
            }
        }

        this.uiController.cleanup();
    }

    createPracticeExam(subject, count = 5) {
        return this.startExam({
            subject,
            title: `${this.examSystem.getSubjectName(subject)}练习`,
            duration: 30,
            difficulty: 'easy',
            count
        });
    }
}
