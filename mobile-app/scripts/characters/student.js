/**
 * 学生类 - 学生角色逻辑
 */

export class Student {
    constructor(data = {}) {
        this.type = 'student';
        this.id = data.id || this.generateId();
        this.name = data.name || '小明';
        this.gender = data.gender || 'male';
        this.avatar = data.avatar || '👨‍🎓';
        
        this.grade = data.grade || 7;
        this.class_ = data.class_ || '初一(1)班';
        
        this.trait = data.trait || 'balanced';
        this.direction = data.direction || 'all';
        
        this.mood = data.mood || 80;
        this.energy = data.energy || 75;
        this.studyEfficiency = data.studyEfficiency || 70;
        
        this.scores = data.scores || this.initScores();
        this.relationships = data.relationships || {};
        this.club = data.club || null;
        this.position = data.position || null;
        
        this.achievements = data.achievements || [];
        this.statistics = data.statistics || {
            totalStudyTime: 0,
            examsTaken: 0,
            homeworkCompleted: 0
        };
    }

    generateId() {
        return 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initScores() {
        return {
            chinese: 75,
            math: 75,
            english: 75,
            physics: 70,
            chemistry: 70,
            biology: 70,
            history: 75,
            geography: 75,
            politics: 75,
            art: 80,
            music: 80,
            sports: 75
        };
    }

    getData() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            gender: this.gender,
            avatar: this.avatar,
            grade: this.grade,
            class_: this.class_,
            trait: this.trait,
            direction: this.direction,
            mood: this.mood,
            energy: this.energy,
            studyEfficiency: this.studyEfficiency,
            scores: this.scores,
            relationships: this.relationships,
            club: this.club,
            position: this.position,
            achievements: this.achievements,
            statistics: this.statistics
        };
    }

    update(deltaTime) {
        this.mood = Math.max(0, Math.min(100, this.mood));
        this.energy = Math.max(0, Math.min(100, this.energy));
        this.studyEfficiency = Math.max(0, Math.min(100, this.studyEfficiency));
    }

    attendClass(subject) {
        if (this.energy < 20) {
            return { success: false, message: '体力不足，无法上课' };
        }

        const subjectKey = this.getSubjectKey(subject);
        const efficiencyBonus = this.getTraitBonus(subjectKey);
        const learningGain = (10 + Math.random() * 5) * (this.studyEfficiency / 100) * efficiencyBonus;

        this.scores[subjectKey] = Math.min(100, this.scores[subjectKey] + learningGain);
        this.energy -= 10;
        this.statistics.totalStudyTime += 45;

        return {
            success: true,
            gain: learningGain,
            newScore: this.scores[subjectKey]
        };
    }

    doHomework(subject) {
        const subjectKey = this.getSubjectKey(subject);
        const efficiencyBonus = this.getTraitBonus(subjectKey);
        const learningGain = (5 + Math.random() * 3) * efficiencyBonus;

        this.scores[subjectKey] = Math.min(100, this.scores[subjectKey] + learningGain);
        this.energy -= 5;
        this.statistics.homeworkCompleted++;

        return {
            success: true,
            gain: learningGain
        };
    }

    takeExam(exam, mode = 'real') {
        this.statistics.examsTaken++;

        if (mode === 'skip') {
            return this.calculateSkipScore(exam);
        }

        return this.calculateRealScore(exam);
    }

    calculateRealScore(exam) {
        const subjectKey = this.getSubjectKey(exam.subject);
        const baseScore = this.scores[subjectKey];
        const variance = (Math.random() - 0.5) * 20;
        const examFactor = 0.8 + Math.random() * 0.4;
        
        const score = Math.max(0, Math.min(100, (baseScore + variance) * examFactor));
        
        this.scores[subjectKey] = score;

        return {
            score: Math.round(score),
            passed: score >= 60
        };
    }

    calculateSkipScore(exam) {
        const subjectKey = this.getSubjectKey(exam.subject);
        const baseScore = this.scores[subjectKey];
        const performanceCoef = Math.min(1.2, Math.max(0.7, baseScore / 100));
        const mentalityCoef = Math.min(1.1, Math.max(0.8, this.mood / 100));
        const luckCoef = 0.9 + (Math.random() / 100) * 0.2;

        const score = baseScore * performanceCoef * mentalityCoef * luckCoef;
        
        return {
            score: Math.round(Math.min(100, score)),
            passed: score >= 60,
            mode: 'skip'
        };
    }

    getTraitBonus(subjectKey) {
        const bonuses = {
            balanced: 1.0,
            diligent: this.isAcademicSubject(subjectKey) ? 1.2 : 1.0,
            social: 1.0,
            science: this.isScienceSubject(subjectKey) ? 1.25 : 0.85,
            arts: this.isArtsSubject(subjectKey) ? 1.25 : 0.85,
            creative: this.isCreativeSubject(subjectKey) ? 1.25 : 0.85
        };
        return bonuses[this.trait] || 1.0;
    }

    isAcademicSubject(subjectKey) {
        return ['chinese', 'math', 'english', 'history', 'geography', 'politics'].includes(subjectKey);
    }

    isScienceSubject(subjectKey) {
        return ['math', 'physics', 'chemistry', 'biology'].includes(subjectKey);
    }

    isArtsSubject(subjectKey) {
        return ['chinese', 'english', 'history', 'geography'].includes(subjectKey);
    }

    isCreativeSubject(subjectKey) {
        return ['art', 'music', 'sports'].includes(subjectKey);
    }

    getSubjectKey(subject) {
        const subjectMap = {
            '语文': 'chinese', '数学': 'math', '英语': 'english',
            '物理': 'physics', '化学': 'chemistry', '生物': 'biology',
            '历史': 'history', '地理': 'geography', '政治': 'politics',
            '美术': 'art', '音乐': 'music', '体育': 'sports'
        };
        return subjectMap[subject] || subject;
    }

    socialize(target, action) {
        const targetId = target.id || target;
        const relationshipDelta = this.getSocialActionDelta(action);
        
        if (!this.relationships[targetId]) {
            this.relationships[targetId] = 50;
        }
        
        this.relationships[targetId] = Math.max(0, Math.min(100, 
            this.relationships[targetId] + relationshipDelta
        ));

        if (action === 'study_together') {
            this.energy -= 15;
        }

        return {
            newValue: this.relationships[targetId],
            level: this.getRelationshipLevel(this.relationships[targetId])
        };
    }

    getSocialActionDelta(action) {
        const deltas = {
            chat: 3,
            study_together: 5,
            play: 5,
            gift: 10,
            dinner: 15
        };
        return deltas[action] || 0;
    }

    getRelationshipLevel(value) {
        if (value >= 91) return '挚友';
        if (value >= 71) return '知己';
        if (value >= 51) return '朋友';
        return '同学';
    }

    getAverageScore() {
        const academicSubjects = ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'politics'];
        let total = 0;
        let count = 0;
        
        academicSubjects.forEach(subject => {
            if (this.scores[subject] !== undefined) {
                total += this.scores[subject];
                count++;
            }
        });

        return count > 0 ? total / count : 0;
    }

    getRank() {
        const avgScore = this.getAverageScore();
        const baseRank = Math.max(1, Math.floor(200 - avgScore * 1.5));
        return baseRank + Math.floor(Math.random() * 10);
    }

    canPromote() {
        return this.getAverageScore() >= 60;
    }

    promote() {
        if (this.grade >= 12) {
            return { success: false, message: '已达到最高年级' };
        }

        if (!this.canPromote()) {
            return { success: false, message: '成绩未达标，无法升级' };
        }

        this.grade++;
        return { success: true, newGrade: this.grade };
    }
}
