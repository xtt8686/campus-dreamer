/**
 * UI控制器 - 用户界面管理
 */

export class UIController {
    constructor() {
        this.currentScreen = 'start-screen';
        this.modals = new Map();
        this.toasts = [];
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    showModal(content, options = {}) {
        const modal = document.getElementById('modal-container');
        const contentEl = document.getElementById('modal-content');
        
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            contentEl.innerHTML = '';
            contentEl.appendChild(content);
        }

        modal.classList.remove('hidden');
        modal.classList.add('active');

        const closeBtn = contentEl.querySelector('[data-close-modal]') || 
                        document.createElement('button');
        
        if (!closeBtn.dataset.closeModal) {
            closeBtn.textContent = '关闭';
            closeBtn.style.cssText = 'margin-top: 1.5rem; padding: 0.5rem 1.5rem; background: #6b7280; color: white; border: none; border-radius: 0.5rem; cursor: pointer;';
            closeBtn.dataset.closeModal = 'true';
            closeBtn.addEventListener('click', () => this.hideModal());
            contentEl.appendChild(closeBtn);
        }

        const backdrop = modal.querySelector('.modal-backdrop');
        backdrop.onclick = () => this.hideModal();

        return modal;
    }

    hideModal() {
        const modal = document.getElementById('modal-container');
        modal.classList.add('hidden');
        modal.classList.remove('active');
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span style="font-size: 1.25rem;">
                ${this.getToastIcon(type)}
            </span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💡'
        };
        return icons[type] || icons.info;
    }

    updateElement(selector, updates) {
        const element = document.querySelector(selector);
        if (!element) return;

        Object.entries(updates).forEach(([key, value]) => {
            if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'classList') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        });
    }

    showLoading(element) {
        const target = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
        
        if (target) {
            target.innerHTML = '<div class="loading-spinner">⏳ 加载中...</div>';
        }
    }

    hideLoading(element) {
        const target = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
        
        if (target) {
            const spinner = target.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }

    createProgressBar(value, max = 100, color = 'primary') {
        const percentage = (value / max) * 100;
        return `
            <div class="progress-bar" style="height: 8px; background: #e5e7eb; border-radius: 9999px; overflow: hidden;">
                <div class="progress-fill" style="width: ${percentage}%; height: 100%; background: var(--${color}); border-radius: 9999px; transition: width 0.3s ease;"></div>
            </div>
        `;
    }

    showConfirm(message, onConfirm, onCancel) {
        const modalContent = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <p style="margin-bottom: 1.5rem; color: #374151;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="confirm-cancel" style="padding: 0.5rem 1.5rem; background: #6b7280; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">取消</button>
                    <button id="confirm-ok" style="padding: 0.5rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">确定</button>
                </div>
            </div>
        `;

        this.showModal(modalContent);

        document.getElementById('confirm-ok').addEventListener('click', () => {
            this.hideModal();
            if (onConfirm) onConfirm();
        });

        document.getElementById('confirm-cancel').addEventListener('click', () => {
            this.hideModal();
            if (onCancel) onCancel();
        });
    }

    renderList(containerSelector, items, renderItem) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = items.map(renderItem).join('');
    }

    addNotification(notification) {
        const list = document.getElementById('notification-list');
        if (!list) return;

        const item = document.createElement('div');
        item.className = 'notification-item';
        item.innerHTML = `
            <div class="notification-icon">${notification.icon || '📢'}</div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-time">${notification.time || '刚刚'}</div>
            </div>
        `;

        list.insertBefore(item, list.firstChild);
    }

    highlightElement(selector, duration = 1000) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.6)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, duration);
    }

    renderExamStart(exam, examSystem, onStart, onSkip) {
        const content = `
            <div class="exam-start-modal">
                <div class="exam-header">
                    <h2>${exam.title}</h2>
                    <div class="exam-meta">
                        <span>📚 ${examSystem.getSubjectName(exam.subject)}</span>
                        <span>⏱️ ${exam.duration}分钟</span>
                        <span>📝 ${exam.questions.length}题</span>
                        <span>💯 ${exam.totalScore}分</span>
                    </div>
                </div>
                
                <div class="exam-sections-preview">
                    <h4>试卷结构</h4>
                    ${exam.sections.map(section => `
                        <div class="section-preview">
                            <span class="section-name">${section.name}</span>
                            <span class="section-info">${section.questions.length}题 / ${section.totalScore}分</span>
                        </div>
                    `).join('')}
                </div>

                <div class="exam-modes">
                    <h4>答题方式</h4>
                    <div class="mode-options">
                        <div class="mode-option selected" data-mode="real">
                            <div class="mode-icon">✍️</div>
                            <div class="mode-title">真实答题</div>
                            <div class="mode-desc">自己做题，获得真实成绩</div>
                        </div>
                        <div class="mode-option" data-mode="skip">
                            <div class="mode-icon">⏭️</div>
                            <div class="mode-title">跳过考试</div>
                            <div class="mode-desc">根据平时成绩获得估算分数</div>
                        </div>
                    </div>
                </div>

                <div class="exam-warning">
                    ⚠️ 开始后无法暂停，请确保时间充裕
                </div>

                <div class="exam-actions">
                    <button class="btn-back" data-close-modal>取消</button>
                    <button class="btn-primary" id="btn-start-exam">开始考试</button>
                </div>
            </div>
        `;

        this.showModal(content);
        
        document.getElementById('btn-start-exam').addEventListener('click', () => {
            const mode = document.querySelector('.mode-option.selected')?.dataset.mode || 'real';
            this.hideModal();
            if (mode === 'skip') {
                onSkip();
            } else {
                onStart();
            }
        });
    }

    renderExamInterface(exam, examSystem, onAnswer, onNavigate, onSubmit) {
        const content = document.createElement('div');
        content.className = 'exam-interface';
        content.innerHTML = `
            <div class="exam-nav-bar">
                <div class="exam-timer">
                    <span class="timer-icon">⏱️</span>
                    <span class="timer-display" id="exam-timer">00:00</span>
                </div>
                <div class="exam-progress-info">
                    <span id="exam-progress-text">第1题 / 共${exam.questions.length}题</span>
                    <div class="exam-sections-nav" id="sections-nav"></div>
                </div>
                <button class="btn-submit-exam" id="btn-submit-exam">交卷</button>
            </div>

            <div class="exam-body">
                <div class="exam-question-panel" id="question-panel">
                    ${this.renderCurrentQuestion(exam, examSystem, 0)}
                </div>

                <div class="exam-sidebar">
                    <div class="question-navigator">
                        <h4>题号导航</h4>
                        <div class="navigator-grid" id="navigator-grid"></div>
                    </div>
                    
                    <div class="section-jumper">
                        <h4>题型切换</h4>
                        <div class="section-buttons" id="section-buttons"></div>
                    </div>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });

        this.initExamTimer(exam, examSystem);
        this.initNavigator(exam, examSystem, onNavigate);
        this.initSectionButtons(exam, examSystem, onNavigate);
        this.initQuestionPanel(exam, examSystem, onAnswer);
        this.initSubmitButton(exam, examSystem, onSubmit);
    }

    renderCurrentQuestion(exam, examSystem, index) {
        const question = exam.questions[index];
        if (!question) return '';

        let answerInput = '';

        switch (question.type) {
            case 'choice':
                answerInput = this.renderChoiceQuestion(question, exam.answers[question.id]?.value);
                break;
            case 'fill':
                answerInput = this.renderFillQuestion(question, exam.answers[question.id]?.value);
                break;
            case 'judge':
                answerInput = this.renderJudgeQuestion(question, exam.answers[question.id]?.value);
                break;
            case 'solve':
                answerInput = this.renderSolveQuestion(question, exam.answers[question.id]?.value);
                break;
            case 'composition':
                answerInput = this.renderCompositionQuestion(question, exam.answers[question.id]?.value);
                break;
        }

        const typeNames = {
            choice: '选择题',
            fill: '填空题',
            judge: '判断题',
            solve: '解答题',
            composition: '作文题'
        };

        return `
            <div class="question-container" data-question-id="${question.id}">
                <div class="question-header">
                    <div class="question-type-badge">${typeNames[question.type] || question.type}</div>
                    <div class="question-score">${question.score}分</div>
                </div>
                <div class="question-content">
                    <div class="question-text">${question.question}</div>
                    <div class="answer-section">
                        ${answerInput}
                    </div>
                </div>
                <div class="question-nav-buttons">
                    <button class="nav-btn prev" id="btn-prev-question" ${index === 0 ? 'disabled' : ''}>
                        ← 上一题
                    </button>
                    <button class="nav-btn next" id="btn-next-question" ${index === exam.questions.length - 1 ? 'disabled' : ''}>
                        下一题 →
                    </button>
                </div>
            </div>
        `;
    }

    renderChoiceQuestion(question, savedAnswer) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        return `
            <div class="choice-options">
                ${question.options.map((opt, i) => `
                    <label class="choice-option ${savedAnswer === i ? 'selected' : ''}">
                        <input type="radio" name="choice-answer" value="${i}" ${savedAnswer === i ? 'checked' : ''}>
                        <span class="option-letter">${letters[i]}</span>
                        <span class="option-text">${opt}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderFillQuestion(question, savedAnswer) {
        const blankCount = (question.question.match(/____/g) || ['____']).length;
        const answers = savedAnswer || [];

        return `
            <div class="fill-inputs">
                <p class="fill-hint">请在下方输入答案（多个空请用逗号分隔）：</p>
                ${question.hint ? `<p class="fill-tip">💡 提示：${question.hint}</p>` : ''}
                <div class="input-row">
                    ${Array(blankCount).fill(0).map((_, i) => `
                        <div class="fill-blank">
                            <span class="blank-label">第${i + 1}空：</span>
                            <input type="text" class="fill-input" data-blank="${i}" value="${answers[i] || ''}" placeholder="答案${i + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderJudgeQuestion(question, savedAnswer) {
        return `
            <div class="judge-options">
                <p class="judge-hint">请判断以下说法的正误：</p>
                <div class="judge-buttons">
                    <button class="judge-btn ${savedAnswer === true ? 'selected' : ''}" data-value="true">
                        <span class="judge-icon">✓</span>
                        <span>正确</span>
                    </button>
                    <button class="judge-btn ${savedAnswer === false ? 'selected' : ''}" data-value="false">
                        <span class="judge-icon">✗</span>
                        <span>错误</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderSolveQuestion(question, savedAnswer) {
        return `
            <div class="solve-area">
                <p class="solve-hint">请写出解题过程和答案：</p>
                ${question.hint ? `<p class="solve-tip">💡 提示：${question.hint}</p>` : ''}
                <textarea class="solve-input" id="solve-answer" placeholder="请输入解题步骤和答案...">${savedAnswer || ''}</textarea>
                <div class="solve-info">
                    <span class="char-count"><span id="char-count">0</span> 字</span>
                    <span class="step-hint">建议包含：解题思路、关键步骤、最终答案</span>
                </div>
            </div>
        `;
    }

    renderCompositionQuestion(question, savedAnswer) {
        return `
            <div class="composition-area">
                <div class="composition-requirements">
                    <h4>📋 写作要求</h4>
                    <ul>
                        <li>字数要求：不少于${question.rubric?.content ? 400 : 600}字</li>
                        <li>内容评分（${question.rubric?.content || 30}分）：切题、内容充实、立意深刻</li>
                        <li>结构评分（${question.rubric?.structure || 15}分）：层次分明、逻辑清晰</li>
                        <li>语言评分（${question.rubric?.language || 15}分）：表达流畅、用词准确</li>
                    </ul>
                </div>
                <textarea class="composition-input" id="composition-answer" placeholder="请开始写作...">${savedAnswer || ''}</textarea>
                <div class="composition-info">
                    <div class="word-count">
                        <span>已写：<strong id="word-count">0</strong> 字</span>
                        <span class="required-count">要求：≥600字</span>
                    </div>
                    <div class="composition-tips">
                        <span>💡 建议：先列提纲，再展开写作</span>
                    </div>
                </div>
            </div>
        `;
    }

    initExamTimer(exam, examSystem) {
        const timerEl = document.getElementById('exam-timer');
        if (!timerEl) return;

        const updateTimer = () => {
            const timeInfo = examSystem.getRemainingTime();
            if (!timeInfo) return;

            const minutes = Math.floor(timeInfo.remaining / 60);
            const seconds = Math.floor(timeInfo.remaining % 60);
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeInfo.percentage < 20) {
                timerEl.classList.add('urgent');
            }

            if (timeInfo.remaining <= 0) {
                timerEl.textContent = '时间到！';
                timerEl.classList.add('time-up');
            }
        };

        updateTimer();
        this.examTimerInterval = setInterval(updateTimer, 1000);
    }

    initNavigator(exam, examSystem, onNavigate) {
        const grid = document.getElementById('navigator-grid');
        if (!grid) return;

        grid.innerHTML = exam.questions.map((q, i) => {
            const isAnswered = exam.answers[q.id] !== undefined;
            const isCurrent = i === exam.currentQuestion;
            return `
                <button class="nav-item ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}" 
                        data-index="${i}">
                    ${i + 1}
                </button>
            `;
        }).join('');

        grid.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (onNavigate) onNavigate(index);
            });
        });
    }

    initSectionButtons(exam, examSystem, onNavigate) {
        const container = document.getElementById('section-buttons');
        if (!container) return;

        container.innerHTML = exam.sections.map((section, i) => `
            <button class="section-nav-btn ${i === exam.currentSection ? 'active' : ''}" 
                    data-section="${i}">
                ${section.name}
            </button>
        `).join('');

        container.querySelectorAll('.section-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sectionIndex = parseInt(btn.dataset.section);
                const firstQuestionIndex = exam.questions.findIndex(
                    q => q.id === exam.sections[sectionIndex].questions[0].id
                );
                if (onNavigate && firstQuestionIndex >= 0) {
                    onNavigate(firstQuestionIndex);
                }
            });
        });
    }

    initQuestionPanel(exam, examSystem, onAnswer) {
        const panel = document.getElementById('question-panel');
        if (!panel) return;

        const handleAnswer = (value) => {
            const questionId = exam.questions[exam.currentQuestion].id;
            examSystem.submitAnswer(questionId, value);
            this.updateNavigator(exam, examSystem, onAnswer);
        };

        panel.addEventListener('change', (e) => {
            if (e.target.name === 'choice-answer') {
                handleAnswer(parseInt(e.target.value));
            }
        });

        panel.addEventListener('input', (e) => {
            if (e.target.classList.contains('fill-input')) {
                const blanks = panel.querySelectorAll('.fill-input');
                const answers = Array.from(blanks).map(input => input.value);
                handleAnswer(answers);
            }
            if (e.target.id === 'solve-answer') {
                const charCount = document.getElementById('char-count');
                if (charCount) charCount.textContent = e.target.value.length;
                handleAnswer(e.target.value);
            }
            if (e.target.id === 'composition-answer') {
                const wordCount = document.getElementById('word-count');
                if (wordCount) {
                    const words = e.target.value.replace(/\s/g, '').length;
                    wordCount.textContent = words;
                }
                handleAnswer(e.target.value);
            }
        });

        panel.addEventListener('click', (e) => {
            const judgeBtn = e.target.closest('.judge-btn');
            if (judgeBtn) {
                const value = judgeBtn.dataset.value === 'true';
                handleAnswer(value);
                panel.querySelectorAll('.judge-btn').forEach(btn => btn.classList.remove('selected'));
                judgeBtn.classList.add('selected');
            }
        });

        const prevBtn = document.getElementById('btn-prev-question');
        const nextBtn = document.getElementById('btn-next-question');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (exam.currentQuestion > 0 && onNavigate) {
                    onNavigate(exam.currentQuestion - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (exam.currentQuestion < exam.questions.length - 1 && onNavigate) {
                    onNavigate(exam.currentQuestion + 1);
                }
            });
        }
    }

    updateNavigator(exam, examSystem, onNavigate) {
        const grid = document.getElementById('navigator-grid');
        if (!grid) return;

        grid.querySelectorAll('.nav-item').forEach((btn, i) => {
            const isAnswered = exam.answers[exam.questions[i].id] !== undefined;
            btn.classList.toggle('answered', isAnswered);
            btn.classList.toggle('current', i === exam.currentQuestion);
        });

        const progressText = document.getElementById('exam-progress-text');
        if (progressText) {
            progressText.textContent = `第${exam.currentQuestion + 1}题 / 共${exam.questions.length}题`;
        }
    }

    updateQuestionDisplay(exam, examSystem, onNavigate) {
        const panel = document.getElementById('question-panel');
        if (!panel) return;

        panel.innerHTML = this.renderCurrentQuestion(exam, examSystem, exam.currentQuestion);
        this.updateNavigator(exam, examSystem, onNavigate);
    }

    initSubmitButton(exam, examSystem, onSubmit) {
        const submitBtn = document.getElementById('btn-submit-exam');
        if (!submitBtn) return;

        submitBtn.addEventListener('click', () => {
            this.showSubmitConfirm(exam, examSystem, onSubmit);
        });
    }

    showSubmitConfirm(exam, examSystem, onSubmit) {
        const answered = Object.keys(exam.answers).length;
        const total = exam.questions.length;
        const unanswered = total - answered;

        const modalContent = `
            <div class="submit-confirm-modal">
                <div class="submit-icon">📝</div>
                <h3>确认交卷？</h3>
                <div class="submit-stats">
                    <p>已答题目：<strong>${answered}</strong> / ${total}</p>
                    ${unanswered > 0 ? `<p class="unanswered-warning">⚠️ 还有 ${unanswered} 题未答</p>` : ''}
                </div>
                <div class="submit-actions">
                    <button class="btn-back" id="btn-continue-exam">继续答题</button>
                    <button class="btn-primary" id="btn-confirm-submit">确认交卷</button>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-content');
        const backdrop = document.querySelector('.modal-backdrop');

        container.innerHTML = modalContent;
        backdrop.onclick = null;

        document.getElementById('btn-continue-exam').addEventListener('click', () => {
            container.innerHTML = '';
            this.hideModal();
        });

        document.getElementById('btn-confirm-submit').addEventListener('click', () => {
            this.hideModal();
            if (this.examTimerInterval) {
                clearInterval(this.examTimerInterval);
            }
            if (onSubmit) onSubmit();
        });
    }

    renderExamResult(result, exam, examSystem) {
        const gradeColors = {
            'A': '#10b981',
            'B': '#3b82f6',
            'C': '#f59e0b',
            'D': '#ef4444',
            'E': '#6b7280'
        };

        const content = `
            <div class="exam-result-modal">
                <div class="result-header">
                    <div class="result-icon">${result.percentage >= 60 ? '🎉' : '📚'}</div>
                    <h2>${exam.title}</h2>
                    <div class="result-grade" style="color: ${gradeColors[result.grade]}">
                        ${result.grade}
                    </div>
                </div>

                <div class="result-summary">
                    <div class="summary-item">
                        <div class="summary-value">${result.totalScore}</div>
                        <div class="summary-label">得分</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${result.maxScore}</div>
                        <div class="summary-label">满分</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${result.percentage}%</div>
                        <div class="summary-label">得分率</div>
                    </div>
                </div>

                <div class="result-grade-desc" style="color: ${gradeColors[result.grade]}">
                    ${examSystem.getGradeDescription(result.grade)}
                </div>

                <div class="section-scores">
                    <h4>各题型得分</h4>
                    ${result.sectionScores.map(section => `
                        <div class="section-score-item">
                            <span class="section-name">${section.name}</span>
                            <div class="section-progress">
                                <div class="progress-fill" style="width: ${section.percentage}%; background: ${gradeColors[result.grade]}"></div>
                            </div>
                            <span class="section-score">${section.score}/${section.maxScore}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="result-actions">
                    <button class="btn-secondary" id="btn-view-details">查看详情</button>
                    <button class="btn-primary" data-close-modal>完成</button>
                </div>
            </div>
        `;

        this.showModal(content);
    }

    renderLessonPlanUpload(lessonPlanSystem, onUpload, onAnalyze) {
        const content = `
            <div class="lesson-plan-upload">
                <h2>📚 教师备课系统</h2>
                
                <div class="upload-zone" id="upload-zone">
                    <div class="upload-icon">📤</div>
                    <p class="upload-text">点击或拖拽文件到此处上传</p>
                    <p class="upload-hint">支持 PPT、PPTX、PDF、DOC、DOCX 格式</p>
                    <input type="file" id="file-input" accept=".pdf,.ppt,.pptx,.doc,.docx" hidden>
                </div>

                <div class="upload-progress hidden" id="upload-progress">
                    <div class="progress-info">
                        <span class="file-name" id="file-name"></span>
                        <span class="progress-percent" id="progress-percent">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="material-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>授课科目</label>
                            <select id="material-subject">
                                <option value="math">数学</option>
                                <option value="chinese">语文</option>
                                <option value="english">英语</option>
                                <option value="physics">物理</option>
                                <option value="chemistry">化学</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>授课年级</label>
                            <select id="material-grade">
                                <option value="7">初一</option>
                                <option value="8">初二</option>
                                <option value="9">初三</option>
                                <option value="10">高一</option>
                                <option value="11">高二</option>
                                <option value="12">高三</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>课程主题</label>
                        <input type="text" id="material-topic" placeholder="例如：二次函数图像与性质">
                    </div>
                </div>

                <div class="materials-list" id="materials-list">
                    <h4>已上传材料</h4>
                    <div class="materials-empty">暂无上传材料</div>
                </div>

                <div class="upload-actions">
                    <button class="btn-secondary" data-close-modal>关闭</button>
                    <button class="btn-primary" id="btn-analyze">开始AI分析</button>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });
        this.initLessonPlanUpload(lessonPlanSystem, onUpload, onAnalyze);
    }

    initLessonPlanUpload(lessonPlanSystem, onUpload, onAnalyze) {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        const analyzeBtn = document.getElementById('btn-analyze');

        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0], lessonPlanSystem);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0], lessonPlanSystem);
            }
        });

        analyzeBtn.addEventListener('click', () => {
            const topic = document.getElementById('material-topic').value;
            const subject = document.getElementById('material-subject').value;
            const grade = parseInt(document.getElementById('material-grade').value);
            
            if (onAnalyze) onAnalyze({ topic, subject, grade });
        });
    }

    handleFileUpload(file, lessonPlanSystem) {
        const progressDiv = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        const fileName = document.getElementById('file-name');

        progressDiv.classList.remove('hidden');
        fileName.textContent = file.name;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressDiv.classList.add('hidden');
                    progressFill.style.width = '0%';
                    this.showToast('文件上传成功', 'success');
                    this.updateMaterialsList(lessonPlanSystem);
                }, 500);
            }
            
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
        }, 200);
    }

    updateMaterialsList(lessonPlanSystem) {
        const listContainer = document.getElementById('materials-list');
        const materials = lessonPlanSystem.getMaterials();

        if (materials.length === 0) {
            listContainer.innerHTML = `
                <h4>已上传材料</h4>
                <div class="materials-empty">暂无上传材料</div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <h4>已上传材料 (${materials.length})</h4>
            ${materials.map(mat => `
                <div class="material-item" data-id="${mat.id}">
                    <div class="material-icon">${this.getMaterialIcon(mat.type)}</div>
                    <div class="material-info">
                        <div class="material-name">${mat.name}</div>
                        <div class="material-meta">
                            ${mat.subject} | ${mat.slides || 0}页 | 
                            ${mat.quality || '待分析'}
                        </div>
                    </div>
                    <div class="material-score" style="color: ${lessonPlanSystem.getQualityColor(mat.qualityScore || 0)}">
                        ${lessonPlanSystem.getQualityIcon(mat.qualityScore || 0)} ${mat.qualityScore || '--'}
                    </div>
                </div>
            `).join('')}
        `;
    }

    getMaterialIcon(type) {
        const icons = {
            'ppt': '📊',
            'pptx': '📊',
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝'
        };
        return icons[type] || '📁';
    }

    renderMaterialAnalysis(material) {
        const content = `
            <div class="material-analysis">
                <h2>${this.getMaterialIcon(material.type)} ${material.name}</h2>
                
                <div class="quality-overview">
                    <div class="quality-score" style="background: ${this.getQualityGradient(material.qualityScore)}">
                        <span class="score-value">${material.qualityScore || 0}</span>
                        <span class="score-label">${material.quality || '待评估'}</span>
                    </div>
                </div>

                <div class="analysis-dimensions">
                    <h4>AI评估维度</h4>
                    ${material.analysis ? `
                        <div class="dimension-item">
                            <span class="dim-name">结构完整性</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.structure}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.structure}分</span>
                        </div>
                        <div class="dimension-item">
                            <span class="dim-name">内容质量</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.content}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.content}分</span>
                        </div>
                        <div class="dimension-item">
                            <span class="dim-name">格式规范</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.format}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.format}分</span>
                        </div>
                        <div class="dimension-item">
                            <span class="dim-name">完整度</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.completeness}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.completeness}分</span>
                        </div>
                        <div class="dimension-item">
                            <span class="dim-name">互动性</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.interactivity}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.interactivity}分</span>
                        </div>
                        <div class="dimension-item">
                            <span class="dim-name">视觉设计</span>
                            <div class="dim-bar">
                                <div class="dim-fill" style="width: ${material.analysis.visualDesign}%"></div>
                            </div>
                            <span class="dim-score">${material.analysis.visualDesign}分</span>
                        </div>
                    ` : '<p class="analyzing">正在分析中...</p>'}
                </div>

                ${material.analysis?.strengths?.length ? `
                    <div class="analysis-section strengths">
                        <h4>✨ 优点</h4>
                        <ul>${material.analysis.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                    </div>
                ` : ''}

                ${material.analysis?.weaknesses?.length ? `
                    <div class="analysis-section weaknesses">
                        <h4>⚠️ 待改进</h4>
                        <ul>${material.analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                    </div>
                ` : ''}

                ${material.analysis?.suggestions?.length ? `
                    <div class="analysis-section suggestions">
                        <h4>💡 建议</h4>
                        <ul>${material.analysis.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
                    </div>
                ` : ''}

                <div class="analysis-actions">
                    <button class="btn-primary" data-close-modal>完成</button>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });
    }

    getQualityGradient(score) {
        if (score >= 90) return 'linear-gradient(135deg, #10b981, #059669)';
        if (score >= 75) return 'linear-gradient(135deg, #3b82f6, #2563eb)';
        if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
        if (score >= 45) return 'linear-gradient(135deg, #ef4444, #dc2626)';
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }

    renderPESports(peSystem) {
        const content = `
            <div class="pe-interface">
                <h2>🏃 体育课中心</h2>
                
                <div class="sports-grid">
                    ${Object.entries(peSystem.sports).map(([key, sport]) => `
                        <div class="sport-card" data-sport="${key}">
                            <div class="sport-icon">${sport.icon}</div>
                            <div class="sport-name">${sport.name}</div>
                            <div class="sport-types">${sport.types.slice(0, 3).join('、')}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="pe-options">
                    <h4>课程类型</h4>
                    <div class="option-buttons">
                        <button class="option-btn selected" data-type="training">
                            <span>🏋️</span> 常规训练
                        </button>
                        <button class="option-btn" data-type="competition">
                            <span>🏆</span> 竞赛练习
                        </button>
                        <button class="option-btn" data-type="free">
                            <span>🎮</span> 自由活动
                        </button>
                    </div>
                </div>

                <div class="training-program">
                    <h4>推荐训练计划</h4>
                    <div class="program-list">
                        <div class="program-item">
                            <div class="program-header">
                                <span class="program-name">基础训练</span>
                                <span class="program-level">初级</span>
                            </div>
                            <div class="program-content">
                                <div class="activity-item">热身跑 10分钟</div>
                                <div class="activity-item">基础训练 15分钟</div>
                                <div class="activity-item">技能练习 15分钟</div>
                                <div class="activity-item">放松整理 5分钟</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pe-actions">
                    <button class="btn-secondary" data-close-modal>关闭</button>
                    <button class="btn-primary" id="btn-start-pe">开始体育课</button>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });
    }

    renderPEActivity(peSystem, activity) {
        const content = `
            <div class="pe-activity">
                <div class="activity-header">
                    <div class="activity-icon">${peSystem.sports[activity.sport]?.icon || '🏃'}</div>
                    <div class="activity-info">
                        <h3>${activity.name}</h3>
                        <span class="activity-duration">${activity.duration}分钟</span>
                    </div>
                </div>

                <div class="activity-instructions">
                    <h4>动作指导</h4>
                    <p>${activity.description || '按照标准动作完成训练'}</p>
                </div>

                <div class="activity-controls">
                    <div class="effort-slider">
                        <label>投入程度</label>
                        <input type="range" id="effort-input" min="1" max="10" value="7">
                        <div class="effort-labels">
                            <span>轻松</span>
                            <span>中等</span>
                            <span>全力</span>
                        </div>
                    </div>
                </div>

                <div class="activity-result">
                    <h4>训练效果预览</h4>
                    <div class="result-preview">
                        <div class="result-item">
                            <span class="result-label">预计得分</span>
                            <span class="result-value" id="preview-score">85</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">体力消耗</span>
                            <span class="result-value">${activity.energyCost || 5}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">经验获得</span>
                            <span class="result-value">+${Math.round((activity.energyCost || 5) * 2)} EXP</span>
                        </div>
                    </div>
                </div>

                <div class="activity-actions">
                    <button class="btn-secondary" id="btn-cancel-activity">取消</button>
                    <button class="btn-primary" id="btn-complete-activity">完成训练</button>
                </div>
            </div>
        `;

        this.showModal(content);
    }

    renderParentConference(conferenceSystem) {
        const upcoming = conferenceSystem.getUpcomingConferences();
        const past = conferenceSystem.getPastConferences();

        const content = `
            <div class="conference-interface">
                <h2>👨‍👩‍👧 家长会系统</h2>
                
                <div class="conference-tabs">
                    <button class="tab-btn active" data-tab="upcoming">即将召开</button>
                    <button class="tab-btn" data-tab="past">历史记录</button>
                </div>

                <div class="conference-content">
                    <div class="tab-panel active" id="panel-upcoming">
                        ${upcoming.length > 0 ? upcoming.map(conf => `
                            <div class="conference-card" data-id="${conf.id}">
                                <div class="conf-header">
                                    <h3>${conf.title}</h3>
                                    <span class="conf-status upcoming">即将召开</span>
                                </div>
                                <div class="conf-details">
                                    <p>📅 ${new Date(conf.date).toLocaleDateString('zh-CN')}</p>
                                    <p>📍 ${conf.location}</p>
                                    <p>👤 主持人：${conf.host}</p>
                                </div>
                                <div class="conf-agenda">
                                    <h4>议程安排</h4>
                                    ${conf.agenda.slice(0, 3).map(item => `
                                        <div class="agenda-item">
                                            <span class="agenda-time">${item.time}min</span>
                                            <span class="agenda-title">${item.title}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="btn-join">查看详情</button>
                            </div>
                        `).join('') : '<p class="empty-state">暂无即将召开的家长会</p>'}
                    </div>

                    <div class="tab-panel" id="panel-past">
                        ${past.length > 0 ? past.map(conf => `
                            <div class="conference-card past" data-id="${conf.id}">
                                <div class="conf-header">
                                    <h3>${conf.title}</h3>
                                    <span class="conf-status completed">已完成</span>
                                </div>
                                <div class="conf-details">
                                    <p>📅 ${new Date(conf.date).toLocaleDateString('zh-CN')}</p>
                                    <p>👨‍👩‍👧 出席人数：${conf.attendees?.length || 0}人</p>
                                </div>
                                <button class="btn-report" data-id="${conf.id}">查看报告</button>
                            </div>
                        `).join('') : '<p class="empty-state">暂无历史家长会记录</p>'}
                    </div>
                </div>

                <div class="conference-actions">
                    <button class="btn-secondary" data-close-modal>关闭</button>
                    <button class="btn-primary" id="btn-new-conference">新建家长会</button>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });
    }

    renderConferenceDetails(conference) {
        const content = `
            <div class="conference-details">
                <h2>📋 ${conference.title}</h2>
                
                <div class="conf-info">
                    <div class="info-row">
                        <span class="info-label">日期时间</span>
                        <span class="info-value">${new Date(conference.date).toLocaleString('zh-CN')}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">会议地点</span>
                        <span class="info-value">${conference.location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">主持人</span>
                        <span class="info-value">${conference.host}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">会议时长</span>
                        <span class="info-value">${conference.duration}分钟</span>
                    </div>
                </div>

                <div class="conf-agenda-full">
                    <h3>📝 会议议程</h3>
                    <div class="agenda-timeline">
                        ${conference.agenda.map((item, i) => `
                            <div class="timeline-item">
                                <div class="timeline-time">${item.time}-${item.time + item.duration}分钟</div>
                                <div class="timeline-content">
                                    <h4>${item.title}</h4>
                                    <p>主讲人：${item.speaker}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${conference.attendees?.length > 0 ? `
                    <div class="conf-attendees">
                        <h3>👥 出席家长</h3>
                        <p>已报名：${conference.attendees.length}人</p>
                    </div>
                ` : ''}

                <div class="details-actions">
                    <button class="btn-secondary" data-close-modal>关闭</button>
                </div>
            </div>
        `;

        this.showModal(content, { large: true });
    }

    cleanup() {
        if (this.examTimerInterval) {
            clearInterval(this.examTimerInterval);
            this.examTimerInterval = null;
        }
    }
}
