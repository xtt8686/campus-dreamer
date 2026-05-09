/**
 * 校园梦想家 - Campus Dreamer
 * 游戏主入口文件
 */

import { GameEngine } from './game-engine.js';
import { DataManager } from './data-manager.js';
import { UIController } from './ui-controller.js';
import { PlayerFactory } from './characters/player.js';
import { TimeSystem } from './modules/time-system.js';
import { ExamSystem } from './modules/exam-system.js';
import { SocialSystem } from './modules/social-system.js';
import { EventSystem } from './modules/event-system.js';
import { AISystem } from './ai-system.js';

class CampusDreamer {
    constructor() {
        this.engine = null;
        this.dataManager = null;
        this.uiController = null;
        this.timeSystem = null;
        this.examSystem = null;
        this.socialSystem = null;
        this.eventSystem = null;
        this.aiSystem = null;
        this.player = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            this.dataManager = new DataManager();
            this.uiController = new UIController();
            this.timeSystem = new TimeSystem();
            this.examSystem = new ExamSystem();
            this.socialSystem = new SocialSystem();
            this.eventSystem = new EventSystem();
            this.aiSystem = new AISystem();

            this.engine = new GameEngine(
                this.dataManager,
                this.uiController,
                this.timeSystem,
                this.examSystem,
                this.socialSystem,
                this.eventSystem,
                this.aiSystem
            );

            this.bindEvents();
            this.checkSavedGame();

            this.isInitialized = true;
            console.log('🎮 校园梦想家初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            this.uiController.showToast('游戏初始化失败', 'error');
        }
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupStartScreen();
            this.setupCreateScreen();
            this.setupGameScreen();
            this.setupNavigation();
            this.setupSpeedControl();
            this.setupNotifications();
        });
    }

    checkSavedGame() {
        const savedData = this.dataManager.load();
        const continueBtn = document.getElementById('btn-continue');
        
        if (savedData) {
            continueBtn.disabled = false;
            continueBtn.addEventListener('click', () => this.continueGame(savedData));
        }
    }

    setupStartScreen() {
        const newGameBtn = document.getElementById('btn-new-game');
        const settingsBtn = document.getElementById('btn-settings');

        newGameBtn.addEventListener('click', () => {
            this.uiController.showScreen('create-screen');
        });

        settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
    }

    setupCreateScreen() {
        const backBtn = document.getElementById('btn-back-to-start');
        const confirmBtn = document.getElementById('btn-confirm-create');
        const characterCards = document.querySelectorAll('.character-card');
        const traitCards = document.querySelectorAll('.trait-card');
        const modeCards = document.querySelectorAll('.mode-card');
        const deptCards = document.querySelectorAll('.department-card');

        backBtn.addEventListener('click', () => {
            this.uiController.showScreen('start-screen');
        });

        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                characterCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.updateCreateOptions(card.dataset.type);
            });
        });

        traitCards.forEach(card => {
            card.addEventListener('click', () => {
                traitCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        modeCards.forEach(card => {
            card.addEventListener('click', () => {
                modeCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        deptCards.forEach(card => {
            card.addEventListener('click', () => {
                deptCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        confirmBtn.addEventListener('click', () => this.createNewGame());
    }

    updateCreateOptions(type) {
        const studentOptions = document.getElementById('student-options');
        const teacherOptions = document.getElementById('teacher-options');
        const principalOptions = document.getElementById('principal-options');

        studentOptions.classList.add('hidden');
        teacherOptions.classList.add('hidden');
        principalOptions.classList.add('hidden');

        switch(type) {
            case 'student':
                studentOptions.classList.remove('hidden');
                break;
            case 'teacher':
                teacherOptions.classList.remove('hidden');
                break;
            case 'principal':
                principalOptions.classList.remove('hidden');
                break;
        }
    }

    createNewGame() {
        const nameInput = document.getElementById('player-name');
        const name = nameInput.value.trim() || '小明';

        const selectedCharacter = document.querySelector('.character-card.selected');
        const characterType = selectedCharacter.dataset.type;

        let playerData = {
            type: characterType,
            name: name,
            createdAt: Date.now()
        };

        if (characterType === 'student') {
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const grade = parseInt(document.getElementById('grade').value);
            const trait = document.querySelector('.trait-card.selected').dataset.trait;
            const direction = document.querySelector('input[name="direction"]:checked').value;

            playerData = {
                ...playerData,
                gender,
                grade,
                trait,
                direction,
                avatar: gender === 'male' ? '👨‍🎓' : '👩‍🎓'
            };
        } else if (characterType === 'teacher') {
            const subject = document.getElementById('subject').value;
            const isProfessional = document.querySelector('.mode-card.selected').dataset.mode === 'professional';

            playerData = {
                ...playerData,
                subject,
                isProfessional,
                avatar: '👨‍🏫',
                title: '助教',
                performance: 0
            };
        } else if (characterType === 'principal') {
            const managedDept = document.querySelector('.department-card.selected').dataset.dept;

            playerData = {
                ...playerData,
                managedDepartment: managedDept,
                avatar: '👨‍💼',
                schoolLevel: 1,
                reputation: 50
            };
        }

        this.player = PlayerFactory.create(playerData);
        this.dataManager.setPlayerData(playerData);
        
        this.engine.setPlayer(this.player);
        this.engine.initGameData();

        this.uiController.showScreen('game-screen');
        this.updatePlayerDisplay();
        this.startGame();
    }

    continueGame(savedData) {
        this.player = PlayerFactory.create(savedData.player);
        this.engine.setPlayer(this.player);
        this.engine.loadGameData(savedData);

        this.uiController.showScreen('game-screen');
        this.updatePlayerDisplay();
        this.startGame();
    }

    updatePlayerDisplay() {
        const avatarEl = document.getElementById('player-avatar');
        const nameEl = document.getElementById('player-name-display');
        const roleEl = document.getElementById('player-role-display');

        avatarEl.textContent = this.player.avatar || '👤';
        nameEl.textContent = this.player.name;

        if (this.player.type === 'student') {
            roleEl.textContent = `${this.getGradeName(this.player.grade)}学生`;
        } else if (this.player.type === 'teacher') {
            roleEl.textContent = `${this.player.title}·${this.getSubjectName(this.player.subject)}`;
        } else {
            roleEl.textContent = '校长';
        }
    }

    getGradeName(grade) {
        const names = {
            7: '初一', 8: '初二', 9: '初三',
            10: '高一', 11: '高二', 12: '高三'
        };
        return names[grade] || `高${grade-9}`;
    }

    getSubjectName(subject) {
        const names = {
            chinese: '语文', math: '数学', english: '英语',
            physics: '物理', chemistry: '化学', biology: '生物',
            history: '历史', geography: '地理', art: '美术', music: '音乐'
        };
        return names[subject] || subject;
    }

    startGame() {
        this.engine.start();
        this.uiController.showToast('欢迎来到校园梦想家！', 'success');
    }

    setupGameScreen() {
        const settingsBtn = document.getElementById('btn-game-settings');
        settingsBtn.addEventListener('click', () => this.showSettingsModal());

        const quickExamBtn = document.getElementById('btn-quick-exam');
        if (quickExamBtn) {
            quickExamBtn.addEventListener('click', () => {
                this.engine.startExam({
                    subject: 'math',
                    title: '数学单元测试',
                    duration: 60,
                    difficulty: 'medium',
                    count: 10
                });
            });
        }

        const examPrepareBtn = document.getElementById('btn-exam-prepare');
        if (examPrepareBtn) {
            examPrepareBtn.addEventListener('click', () => {
                this.engine.createPracticeExam('math', 5);
            });
        }

        const examSkipBtn = document.getElementById('btn-exam-skip');
        if (examSkipBtn) {
            examSkipBtn.addEventListener('click', () => {
                this.engine.startExam({
                    subject: 'math',
                    title: '数学月考',
                    duration: 90,
                    difficulty: 'medium',
                    count: 15
                });
            });
        }
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(pageName) {
        const navBtns = document.querySelectorAll('.nav-btn');
        const pages = document.querySelectorAll('.page');

        navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === pageName);
        });

        pages.forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageName}`);
        });
    }

    setupSpeedControl() {
        const speedBtns = document.querySelectorAll('.speed-btn');
        
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseInt(btn.dataset.speed);
                if (speed) {
                    this.engine.setSpeed(speed);
                    speedBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else if (btn.textContent === '▶️') {
                    this.engine.resume();
                    speedBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });
    }

    setupNotifications() {
        const notifBtn = document.getElementById('btn-notifications');
        const closeBtn = document.getElementById('btn-close-notifications');
        const panel = document.getElementById('notification-panel');

        notifBtn.addEventListener('click', () => {
            panel.classList.toggle('hidden');
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }

    showSettingsModal() {
        const modal = document.getElementById('modal-container');
        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <h2 style="margin-bottom: 1.5rem; color: #1f2937;">⚙️ 游戏设置</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">🔊 音效</h3>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="sound-toggle" checked> 开启音效
                    </label>
                </div>
                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">📊 数据管理</h3>
                    <button id="btn-save-game" style="padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin-right: 0.5rem;">💾 保存游戏</button>
                    <button id="btn-reset-game" style="padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">🗑️ 重置游戏</button>
                </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                <button id="btn-close-modal" style="padding: 0.5rem 1.5rem; background: #6b7280; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">关闭</button>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('active');

        document.getElementById('btn-close-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('active');
        });

        document.getElementById('btn-save-game').addEventListener('click', () => {
            this.saveGame();
        });

        document.getElementById('btn-reset-game').addEventListener('click', () => {
            if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
                this.resetGame();
            }
        });
    }

    saveGame() {
        const gameData = this.engine.getGameData();
        this.dataManager.save(gameData);
        this.uiController.showToast('游戏已保存！', 'success');
    }

    resetGame() {
        this.dataManager.clear();
        location.reload();
    }
}

const game = new CampusDreamer();
game.init();

export default game;
