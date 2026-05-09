/**
 * 教师类 - 教师角色逻辑
 */

export class Teacher {
    constructor(data = {}) {
        this.type = 'teacher';
        this.id = data.id || this.generateId();
        this.name = data.name || '老师';
        this.avatar = data.avatar || '👨‍🏫';
        
        this.subject = data.subject || 'math';
        this.title = data.title || '助教';
        this.isProfessional = data.isProfessional !== undefined ? data.isProfessional : true;
        
        this.performance = data.performance || 0;
        this.scores = data.scores || 0;
        this.lessons = data.lessons || [];
        this.exams = data.exams || [];
        
        this.pptQuality = data.pptQuality || 0;
        this.questionsCreated = data.questionsCreated || 0;
        this.studentRatings = data.studentRatings || [];
        
        this.statistics = data.statistics || {
            totalLessons: 0,
            totalExams: 0,
            avgQuality: 0
        };
    }

    generateId() {
        return 'teacher_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getData() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            subject: this.subject,
            title: this.title,
            isProfessional: this.isProfessional,
            performance: this.performance,
            scores: this.scores,
            lessons: this.lessons,
            exams: this.exams,
            pptQuality: this.pptQuality,
            questionsCreated: this.questionsCreated,
            studentRatings: this.studentRatings,
            statistics: this.statistics
        };
    }

    update(deltaTime) {
        if (this.performance < 0) this.performance = 0;
        if (this.performance > 100) this.performance = 100;
    }

    prepareLesson(config = {}) {
        if (this.isProfessional) {
            return this.professionalPrepareLesson(config);
        }
        return this.casualPrepareLesson(config);
    }

    professionalPrepareLesson(config) {
        const quality = config.quality || 50;
        const pptFile = config.pptFile;

        let lessonQuality = quality;

        if (pptFile) {
            lessonQuality = this.evaluatePPT(pptFile);
            this.pptQuality = lessonQuality;
        }

        const preparationTime = 30;
        const lesson = {
            id: this.generateLessonId(),
            subject: this.subject,
            topic: config.topic,
            quality: lessonQuality,
            pptUsed: !!pptFile,
            preparedAt: Date.now()
        };

        this.lessons.push(lesson);
        this.statistics.totalLessons++;

        return {
            success: true,
            lesson: lesson,
            quality: lessonQuality
        };
    }

    casualPrepareLesson(config) {
        const lessonQuality = 60 + Math.random() * 20;

        const lesson = {
            id: this.generateLessonId(),
            subject: this.subject,
            topic: config.topic,
            quality: lessonQuality,
            pptUsed: false,
            preparedAt: Date.now(),
            auto: true
        };

        this.lessons.push(lesson);
        this.statistics.totalLessons++;

        return {
            success: true,
            lesson: lesson,
            quality: lessonQuality
        };
    }

    evaluatePPT(file) {
        let score = 50;

        const hasContent = file.name && file.name.length > 0;
        if (hasContent) score += 10;

        const hasSlides = file.slides && file.slides > 0;
        if (hasSlides) score += 15;

        const hasImages = file.images && file.images > 0;
        if (hasImages) score += 10;

        const hasAnimation = file.animation;
        if (hasAnimation) score += 10;

        const structure = file.structure || 'basic';
        const structureScores = { basic: 5, medium: 10, good: 15 };
        score += structureScores[structure] || 5;

        return Math.min(100, Math.max(0, score + Math.random() * 10));
    }

    conductClass(lesson) {
        if (this.isProfessional) {
            return this.professionalConductClass(lesson);
        }
        return this.casualConductClass(lesson);
    }

    professionalConductClass(lesson) {
        const baseQuality = lesson.quality;
        const teacherSkill = this.calculateTeacherSkill();
        const classEffectiveness = baseQuality * (0.8 + teacherSkill * 0.4);

        const result = {
            studentUnderstanding: classEffectiveness,
            teacherPerformance: teacherSkill,
            feedback: this.generateClassFeedback(classEffectiveness)
        };

        this.updatePerformance(classEffectiveness * 0.4);

        return result;
    }

    casualConductClass(lesson) {
        const classEffectiveness = lesson.quality * (0.9 + Math.random() * 0.2);

        const result = {
            studentUnderstanding: classEffectiveness,
            teacherPerformance: 70,
            feedback: this.generateClassFeedback(classEffectiveness)
        };

        this.updatePerformance(classEffectiveness * 0.3);

        return result;
    }

    calculateTeacherSkill() {
        const titleBonus = {
            '助教': 0.8,
            '讲师': 1.0,
            '副教授': 1.2,
            '教授': 1.5
        };
        return titleBonus[this.title] || 1.0;
    }

    generateClassFeedback(effectiveness) {
        if (effectiveness >= 90) return '非常棒！学生们都听得很认真';
        if (effectiveness >= 80) return '很好，教学效果优秀';
        if (effectiveness >= 70) return '不错，达到了预期目标';
        if (effectiveness >= 60) return '一般，需要改进教学方法';
        return '效果不佳，建议重新备课';
    }

    createExam(config) {
        const exam = {
            id: this.generateExamId(),
            subject: this.subject,
            title: config.title,
            type: config.type || 'test',
            questions: config.questions || [],
            totalScore: config.totalScore || 100,
            duration: config.duration || 90,
            createdAt: Date.now(),
            quality: this.calculateExamQuality(config)
        };

        this.exams.push(exam);
        this.statistics.totalExams++;
        this.questionsCreated += exam.questions.length;

        this.updatePerformance(exam.quality * 0.2);

        return exam;
    }

    calculateExamQuality(exam) {
        let quality = 50;

        if (exam.questions && exam.questions.length >= 10) quality += 15;
        if (exam.questions && exam.questions.length >= 20) quality += 10;

        if (exam.type === 'midterm') quality += 10;
        if (exam.type === 'final') quality += 15;
        if (exam.type === 'college_entrance') quality += 25;

        quality += Math.random() * 15;

        return Math.min(100, Math.max(0, quality));
    }

    updatePerformance(delta) {
        this.performance = Math.max(0, Math.min(100, this.performance + delta));
    }

    checkPromotion() {
        const promotionCriteria = {
            '助教': {
                semesters: 2,
                performance: 75,
                requirements: ['complete_training']
            },
            '讲师': {
                semesters: 5,
                performance: 80,
                requirements: ['publish_paper']
            },
            '副教授': {
                semesters: 10,
                performance: 85,
                requirements: ['publish_papers', 'lead_research']
            }
        };

        const nextLevel = {
            '助教': '讲师',
            '讲师': '副教授',
            '副教授': '教授'
        };

        const criteria = promotionCriteria[this.title];
        if (!criteria) {
            return { canPromote: false, message: '已达最高职称' };
        }

        if (this.performance >= criteria.performance) {
            const oldTitle = this.title;
            this.title = nextLevel[this.title];
            return {
                canPromote: true,
                newTitle: this.title,
                message: `恭喜晋升为${this.title}！`
            };
        }

        return {
            canPromote: false,
            message: `绩效需要达到${criteria.performance}分，当前${this.performance}分`
        };
    }

    getSubjectName() {
        const names = {
            chinese: '语文',
            math: '数学',
            english: '英语',
            physics: '物理',
            chemistry: '化学',
            biology: '生物',
            history: '历史',
            geography: '地理',
            art: '美术',
            music: '音乐'
        };
        return names[this.subject] || this.subject;
    }

    generateLessonId() {
        return 'lesson_' + Date.now();
    }

    generateExamId() {
        return 'exam_' + Date.now();
    }
}
