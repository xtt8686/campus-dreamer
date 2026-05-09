/**
 * 考试系统 - 管理考试和题目
 * 支持：选择题、填空题、判断题、解答题、作文题
 */

export class ExamSystem {
    constructor() {
        this.currentExam = null;
        this.examHistory = [];
        this.questionBank = this.initQuestionBank();
        this.maxFillBlanks = 3;
    }

    initQuestionBank() {
        return {
            math: {
                easy: this.initMathEasy(),
                medium: this.initMathMedium(),
                hard: this.initMathHard()
            },
            chinese: {
                easy: this.initChineseEasy(),
                medium: this.initChineseMedium(),
                hard: this.initChineseHard()
            },
            english: {
                easy: this.initEnglishEasy(),
                medium: this.initEnglishMedium(),
                hard: this.initEnglishHard()
            },
            physics: {
                easy: this.initPhysicsEasy(),
                medium: this.initPhysicsMedium(),
                hard: this.initPhysicsHard()
            },
            chemistry: {
                easy: this.initChemistryEasy(),
                medium: this.initChemistryMedium(),
                hard: this.initChemistryHard()
            }
        };
    }

    // 数学易难度题目
    initMathEasy() {
        return [
            { id: 'me_1', type: 'choice', category: '计算', question: '1+1=？', options: ['1', '2', '3', '4'], answer: 1, score: 4 },
            { id: 'me_2', type: 'choice', category: '计算', question: '5×6=？', options: ['25', '30', '35', '40'], answer: 1, score: 4 },
            { id: 'me_3', type: 'fill', category: '计算', question: '8+7=____', answer: '15', score: 4, hint: '注意进位' },
            { id: 'me_4', type: 'judge', category: '概念', question: '0是自然数。', answer: true, score: 3 },
            { id: 'me_5', type: 'judge', category: '概念', question: '平行四边形是特殊的长方形。', answer: false, score: 3 },
            { id: 'me_6', type: 'fill', category: '几何', question: '三角形的内角和是____度。', answer: '180', score: 4 },
            { id: 'me_7', type: 'choice', category: '应用', question: '小明有10个苹果，给了小红3个，还剩几个？', options: ['6', '7', '8', '9'], answer: 1, score: 4 }
        ];
    }

    // 数学中等难度题目
    initMathMedium() {
        return [
            { id: 'mm_1', type: 'choice', category: '方程', question: '方程x²=4的解是？', options: ['1', '2', '±2', '4'], answer: 2, score: 4 },
            { id: 'mm_2', type: 'fill', category: '方程', question: '若2x+5=11，则x=____', answer: '3', score: 5 },
            { id: 'mm_3', type: 'judge', category: '函数', question: '一次函数的图像是一条直线。', answer: true, score: 3 },
            { id: 'mm_4', type: 'fill', category: '几何', question: '圆的周长公式是C=____（用π表示）', answer: '2πr', score: 5 },
            { id: 'mm_5', type: 'choice', category: '函数', question: '二次函数y=x²的顶点坐标是？', options: ['(0,0)', '(1,1)', '(0,1)', '(1,0)'], answer: 0, score: 4 },
            { id: 'mm_6', type: 'judge', category: '数论', question: '质数一定是奇数。', answer: false, score: 3 },
            { id: 'mm_7', type: 'fill', category: '计算', question: '(a+b)²=____', answer: 'a²+2ab+b²', score: 6 },
            { id: 'mm_8', type: 'choice', category: '应用', question: '某商品原价100元，打8折后价格是？', options: ['80元', '90元', '85元', '95元'], answer: 0, score: 4 },
            { id: 'mm_9', type: 'solve', category: '方程', question: '解方程：2x-3=7', answer: 'x=5', score: 8, steps: ['移项：2x=10', '系数化为1：x=5', '检验：2×5-3=7✓'] },
            { id: 'mm_10', type: 'solve', category: '几何', question: '已知等腰三角形两边分别为3和6，求第三边的长。', answer: '6', score: 10, hint: '注意三角形两边之和大于第三边' }
        ];
    }

    // 数学高难度题目
    initMathHard() {
        return [
            { id: 'mh_1', type: 'choice', category: '函数', question: '二次函数y=x²-4x+3的顶点坐标是？', options: ['(2,-1)', '(2,1)', '(-2,3)', '(4,3)'], answer: 0, score: 4 },
            { id: 'mh_2', type: 'solve', category: '方程', question: '解方程：x²-5x+6=0', answer: 'x₁=2, x₂=3', score: 10, steps: ['因式分解：(x-2)(x-3)=0', 'x-2=0或x-3=0', 'x₁=2, x₂=3'] },
            { id: 'mh_3', type: 'solve', category: '函数', question: '已知一次函数y=kx+b过点(1,2)和(3,6)，求k和b。', answer: 'k=2, b=0', score: 12, hint: '代入两点坐标求解' },
            { id: 'mh_4', type: 'fill', category: '几何', question: '正方形的对角线长为10，则其面积为____', answer: '50', score: 6 },
            { id: 'mh_5', type: 'solve', category: '综合', question: '某商品连续两次降价，每次降价20%，原价100元，求现价。', answer: '64元', score: 10, steps: ['第一次降价后：100×0.8=80元', '第二次降价后：80×0.8=64元'] },
            { id: 'mh_6', type: 'choice', category: '压轴', question: '若关于x的方程x²+ax+1=0有实数根，则a的取值范围是？', options: ['a≥2或a≤-2', 'a>2或a<-2', '-2<a<2', 'a=±2'], answer: 0, score: 5 }
        ];
    }

    // 语文易难度题目
    initChineseEasy() {
        return [
            { id: 'ce_1', type: 'choice', category: '文学', question: '《春》的作者是？', options: ['鲁迅', '朱自清', '冰心', '老舍'], answer: 1, score: 4 },
            { id: 'ce_2', type: 'choice', category: '字词', question: '"学习"的近义词是？', options: ['玩耍', '读书', '睡觉', '吃饭'], answer: 1, score: 4 },
            { id: 'ce_3', type: 'fill', category: '古诗', question: '《静夜思》中"举头望____，低头思故乡。"', answer: '明月', score: 4 },
            { id: 'ce_4', type: 'judge', category: '语法', question: '"我学习语文"是一个完整的句子。', answer: true, score: 3 },
            { id: 'ce_5', type: 'fill', category: '古诗', question: '《咏鹅》的作者是____岁（骆宾王）时写的。', answer: '七', score: 4 },
            { id: 'ce_6', type: 'choice', category: '文学', question: '下列哪个不是四大名著？', options: ['《红楼梦》', '《西游记》', '《三国演义》', '《聊斋志异》'], answer: 3, score: 4 },
            { id: 'ce_7', type: 'judge', category: '字形', question: '"己"和"已"的读音相同。', answer: false, score: 3 }
        ];
    }

    // 语文中等难度题目
    initChineseMedium() {
        return [
            { id: 'cm_1', type: 'fill', category: '古文', question: '《春》中描写春天的句子："春天像____，从头到脚都是新的。"', answer: '小姑娘', score: 5 },
            { id: 'cm_2', type: 'choice', category: '语法', question: '下列句子中没有语病的是？', options: ['我非常关心', '天气非常关心我', '我非常关心天气', '关心我非常天气'], answer: 2, score: 4 },
            { id: 'cm_3', type: 'fill', category: '古文', question: '《出师表》中"临表涕零"的"临"意思是____。', answer: '面对', score: 5 },
            { id: 'cm_4', type: 'judge', category: '修辞', question: '"飞流直下三千尺"使用了夸张的修辞手法。', answer: true, score: 3 },
            { id: 'cm_5', type: 'fill', category: '古诗', question: '《水调歌头》中"但愿人长久"的下一句是____。', answer: '千里共婵娟', score: 6 },
            { id: 'cm_6', type: 'choice', category: '文学', question: '《红楼梦》的主要作者是？', options: ['曹雪芹', '施耐庵', '罗贯中', '吴承恩'], answer: 0, score: 4 },
            { id: 'cm_7', type: 'fill', category: '阅读', question: '记叙文的六要素包括：时间、地点、人物、____、经过、结果。', answer: '起因', score: 5 }
        ];
    }

    // 语文高难度题目
    initChineseHard() {
        return [
            { id: 'ch_1', type: 'composition', category: '作文', question: '题目：我的梦想\n要求：不少于600字，体裁不限，诗歌除外。', answer: '', score: 60, rubric: { content: 30, structure: 15, language: 15 }, time: 45 },
            { id: 'ch_2', type: 'choice', category: '古文', question: '《滕王阁序》中"落霞与孤鹜齐飞"的下一句是？', options: ['秋水共长天一色', '渔舟唱晚', '雁阵惊寒', '彭泽归来'], answer: 0, score: 4 },
            { id: 'ch_3', type: 'fill', category: '古文', question: '《岳阳楼记》中"先天下之忧而忧，后天下之乐而乐"表现了作者____的情怀。', answer: '忧国忧民', score: 6 },
            { id: 'ch_4', type: 'judge', category: '语法', question: '"春风又绿江南岸"中的"绿"字是使动用法。', answer: true, score: 4 }
        ];
    }

    // 英语易难度题目
    initEnglishEasy() {
        return [
            { id: 'ee_1', type: 'choice', category: '词汇', question: '"Apple"的中文意思是？', options: ['香蕉', '苹果', '橙子', '葡萄'], answer: 1, score: 3 },
            { id: 'ee_2', type: 'choice', category: '语法', question: 'I ___ a student. (be动词填空)', options: ['am', 'is', 'are', 'be'], answer: 0, score: 3 },
            { id: 'ee_3', type: 'fill', category: '词汇', question: 'There are seven ___ in a week. (填序号/基数词)', answer: 'days', score: 3 },
            { id: 'ee_4', type: 'judge', category: '语法', question: '"She go to school by bus." 句子正确。', answer: false, score: 3 },
            { id: 'ee_5', type: 'choice', category: '日常', question: 'How are you? 正确回答是？', options: ['I am 10.', 'I am fine, thank you.', 'My name is Tom.', 'I like apples.'], answer: 1, score: 3 },
            { id: 'ee_6', type: 'fill', category: '句型', question: 'This is ___ apple. (元音前用an)', answer: 'an', score: 3 }
        ];
    }

    // 英语中等难度题目
    initEnglishMedium() {
        return [
            { id: 'em_1', type: 'choice', category: '语法', question: 'She ___ to school every day. (现在时)', options: ['go', 'goes', 'going', 'went'], answer: 1, score: 4 },
            { id: 'em_2', type: 'fill', category: '词汇', question: 'The weather is ___ today than yesterday. (good的比较级)', answer: 'better', score: 4 },
            { id: 'em_3', type: 'choice', category: '阅读', question: 'Which is NOT mentioned in the passage?', options: ['Cats', 'Dogs', 'Birds', 'Fish'], answer: 3, score: 4 },
            { id: 'em_4', type: 'judge', category: '语法', question: '"If I were you, I would take the job." 是虚拟语气。', answer: true, score: 4 },
            { id: 'em_5', type: 'fill', category: '写作', question: 'Please write a sentence using the word "although": ____', answer: 'Although it rained, we still went out.', score: 6 },
            { id: 'em_6', type: 'choice', category: '完形', question: 'The word "benefit" in paragraph 2 means ___', options: ['harm', 'help', 'need', 'want'], answer: 1, score: 4 }
        ];
    }

    // 英语高难度题目
    initEnglishHard() {
        return [
            { id: 'eh_1', type: 'fill', category: '语法', question: 'The book ___ by the famous author last year. (被动语态)', answer: 'was written', score: 6 },
            { id: 'eh_2', type: 'choice', category: '词汇', question: '"The professor demanded that every student ___ the assignment on time."', options: ['submits', 'submitted', 'submit', 'submitting'], answer: 2, score: 4 },
            { id: 'eh_3', type: 'composition', category: '作文', question: 'Write a passage about "Environmental Protection" (about 100 words)', answer: '', score: 25, rubric: { content: 10, structure: 5, language: 10 }, time: 30 }
        ];
    }

    // 物理易难度题目
    initPhysicsEasy() {
        return [
            { id: 'pe_1', type: 'choice', category: '力学', question: '力的单位是？', options: ['千克', '牛顿', '瓦特', '焦耳'], answer: 1, score: 4 },
            { id: 'pe_2', type: 'judge', category: '概念', question: '物体速度越大，其动能一定越大。', answer: false, score: 3 },
            { id: 'pe_3', type: 'fill', category: '力学', question: '重力是由于地球的____而使物体受到的力。', answer: '吸引', score: 4 },
            { id: 'pe_4', type: 'choice', category: '力学', question: '下列哪个不是力的三要素？', options: ['大小', '方向', '作用点', '单位'], answer: 3, score: 4 }
        ];
    }

    // 物理中等难度题目
    initPhysicsMedium() {
        return [
            { id: 'pm_1', type: 'choice', category: '力学', question: '一辆汽车以72km/h的速度行驶，2小时内行驶的距离是？', options: ['36km', '72km', '144km', '18km'], answer: 2, score: 5 },
            { id: 'pm_2', type: 'solve', category: '力学', question: '一个物体质量为10kg，受到重力是多少？（g=10N/kg）', answer: '100N', score: 8, steps: ['G=mg', 'G=10kg×10N/kg', 'G=100N'] },
            { id: 'pm_3', type: 'judge', category: '能量', question: '能量既不会凭空产生，也不会凭空消失，只能从一种形式转化为另一种形式。', answer: true, score: 4 },
            { id: 'pm_4', type: 'fill', category: '力学', question: '物体在平衡力作用下，保持____状态或匀速直线运动状态。', answer: '静止', score: 5 }
        ];
    }

    // 物理高难度题目
    initPhysicsHard() {
        return [
            { id: 'ph_1', type: 'solve', category: '综合', question: '一物体从高度为20m的地方自由落下，求落地时的速度（g=10m/s²）', answer: 'v=20m/s', score: 12, steps: ['v²=2gh', 'v²=2×10×20', 'v=20m/s'] },
            { id: 'ph_2', type: 'choice', category: '压轴', question: '关于机械能守恒定律，下列说法正确的是？', options: ['只有重力做功时，机械能守恒', '机械能守恒时动能一定不变', '只有弹力做功时机械能才守恒', '机械能守恒时势能一定不变'], answer: 0, score: 5 }
        ];
    }

    // 化学易难度题目
    initChemistryEasy() {
        return [
            { id: 'ceh_1', type: 'choice', category: '基础', question: '水的化学式是？', options: ['H2O', 'CO2', 'O2', 'NaCl'], answer: 0, score: 4 },
            { id: 'ceh_2', type: 'judge', category: '概念', question: '氧气能支持燃烧。', answer: true, score: 3 },
            { id: 'ceh_3', type: 'fill', category: '基础', question: '元素周期表中，氢的元素符号是____。', answer: 'H', score: 3 },
            { id: 'ceh_4', type: 'choice', category: '基础', question: '下列哪个是金属元素？', options: ['氧', '碳', '铁', '硫'], answer: 2, score: 4 }
        ];
    }

    // 化学中等难度题目
    initChemistryMedium() {
        return [
            { id: 'cmh_1', type: 'choice', category: '反应', question: '2H2+O2=2H2O的反应类型是？', options: ['化合反应', '分解反应', '置换反应', '复分解反应'], answer: 0, score: 5 },
            { id: 'cmh_2', type: 'solve', category: '计算', question: '计算24g氧气中含有多少摩尔的氧分子？', answer: '0.75mol', score: 8, steps: ['n=m/M', 'n=24g÷32g/mol', 'n=0.75mol'] },
            { id: 'cmh_3', type: 'fill', category: '基础', question: '酸碱指示剂在酸性溶液中显示____色。', answer: '红', score: 5 }
        ];
    }

    // 化学高难度题目
    initChemistryHard() {
        return [
            { id: 'chh_1', type: 'choice', category: '压轴', question: '下列离子能在溶液中大量共存的是？', options: ['Na+和Cl-', 'Ba2+和SO4²-', 'H+和OH-', 'Ag+和Cl-'], answer: 0, score: 5 },
            { id: 'chh_2', type: 'solve', category: '综合', question: '将50g质量分数为20%的NaOH溶液稀释成10%的溶液，需要加水多少克？', answer: '50g', score: 12, steps: ['稀释前后溶质质量不变', '50×20%=m×10%', 'm=100g, 加水50g'] }
        ];
    }

    createExam(config) {
        const exam = {
            id: 'exam_' + Date.now(),
            subject: config.subject || 'math',
            title: config.title || `${this.getSubjectName(config.subject)}单元测试`,
            type: config.type || 'test',
            questions: [],
            totalScore: 0,
            duration: config.duration || 90,
            difficulty: config.difficulty || 'medium',
            grade: config.grade || 7,
            createdAt: Date.now(),
            status: 'pending',
            sections: []
        };

        exam.questions = this.generateQuestions(exam.subject, exam.difficulty, config.count || 10, config.grade);
        exam.sections = this.generateSections(exam.questions);
        exam.totalScore = exam.questions.reduce((sum, q) => sum + q.score, 0);

        return exam;
    }

    generateSections(questions) {
        const sections = [];
        const types = ['choice', 'fill', 'judge', 'solve', 'composition'];
        const typeNames = {
            choice: '选择题',
            fill: '填空题',
            judge: '判断题',
            solve: '解答题',
            composition: '作文题'
        };

        let currentSection = null;
        let currentType = null;

        questions.forEach(q => {
            if (q.type !== currentType) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentType = q.type;
                currentSection = {
                    type: q.type,
                    name: typeNames[q.type] || q.type,
                    questions: [],
                    totalScore: 0
                };
            }
            currentSection.questions.push(q);
            currentSection.totalScore += q.score;
        });

        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    }

    generateQuestions(subject, difficulty, count, grade = 7) {
        const subjectBank = this.questionBank[subject] || this.questionBank.math;
        
        let questionPool = [];
        
        if (difficulty === 'easy') {
            questionPool = [...subjectBank.easy];
        } else if (difficulty === 'hard') {
            questionPool = [...subjectBank.hard, ...subjectBank.medium, ...subjectBank.easy];
        } else {
            questionPool = [...subjectBank.medium, ...subjectBank.easy, ...subjectBank.hard.slice(0, 2)];
        }

        if (grade >= 9) {
            questionPool = [...subjectBank.medium, ...subjectBank.hard];
        }

        const questions = [];
        let remaining = count;

        while (remaining > 0 && questionPool.length > 0) {
            const index = Math.floor(Math.random() * questionPool.length);
            const question = questionPool.splice(index, 1)[0];
            questions.push({ ...question, id: question.id + '_' + Date.now() });
            remaining--;
        }

        return questions;
    }

    startExam(exam) {
        this.currentExam = {
            ...exam,
            status: 'in_progress',
            startTime: Date.now(),
            answers: {},
            currentQuestion: 0,
            currentSection: 0
        };
        return this.currentExam;
    }

    submitAnswer(questionId, answer) {
        if (!this.currentExam) return null;

        const question = this.currentExam.questions.find(q => q.id === questionId);
        if (!question) return null;

        this.currentExam.answers[questionId] = {
            value: answer,
            time: Date.now()
        };

        return {
            saved: true,
            questionId,
            answer
        };
    }

    goToQuestion(index) {
        if (!this.currentExam) return null;
        
        if (index >= 0 && index < this.currentExam.questions.length) {
            this.currentExam.currentQuestion = index;
            return this.currentExam.questions[index];
        }
        return null;
    }

    goToSection(sectionIndex) {
        if (!this.currentExam) return null;
        
        if (sectionIndex >= 0 && sectionIndex < this.currentExam.sections.length) {
            this.currentExam.currentSection = sectionIndex;
            const section = this.currentExam.sections[sectionIndex];
            if (section.questions.length > 0) {
                const firstQuestionIndex = this.currentExam.questions.findIndex(q => q.id === section.questions[0].id);
                this.currentExam.currentQuestion = firstQuestionIndex;
            }
            return section;
        }
        return null;
    }

    finishExam() {
        if (!this.currentExam) return null;

        const result = this.calculateScore(this.currentExam);
        
        this.examHistory.push({
            ...this.currentExam,
            status: 'finished',
            finishTime: Date.now(),
            result
        });

        const finishedExam = this.currentExam;
        this.currentExam = null;

        return {
            exam: finishedExam,
            result
        };
    }

    calculateScore(exam) {
        let totalScore = 0;
        let maxScore = 0;
        const details = [];

        for (const question of exam.questions) {
            maxScore += question.score;
            const answerData = exam.answers[question.id];
            const userAnswer = answerData ? answerData.value : null;
            
            let isCorrect = null;
            let score = 0;

            if (question.type === 'choice') {
                isCorrect = userAnswer === question.answer;
                if (isCorrect) score = question.score;
            } else if (question.type === 'fill') {
                isCorrect = this.checkFillAnswer(userAnswer, question.answer);
                if (isCorrect) score = question.score;
            } else if (question.type === 'judge') {
                isCorrect = userAnswer === question.answer;
                if (isCorrect) score = question.score;
            } else if (question.type === 'solve') {
                const result = this.checkSolveAnswer(userAnswer, question.answer);
                isCorrect = result.isCorrect;
                score = Math.round(question.score * result.percentage / 100);
            } else if (question.type === 'composition') {
                const result = this.evaluateComposition(userAnswer, question);
                score = Math.round(question.score * result.percentage / 100);
                isCorrect = 'pending';
            }

            totalScore += score;

            details.push({
                questionId: question.id,
                type: question.type,
                question: question.question,
                userAnswer,
                correctAnswer: question.answer,
                isCorrect,
                score,
                maxScore: question.score
            });
        }

        const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        const grade = this.getGrade(percentage);

        return {
            totalScore,
            maxScore,
            percentage: Math.round(percentage),
            grade,
            details,
            sectionScores: this.calculateSectionScores(details, exam.sections)
        };
    }

    checkFillAnswer(userAnswer, correctAnswer) {
        if (!userAnswer) return false;
        
        const user = String(userAnswer).trim().toLowerCase();
        const correct = String(correctAnswer).trim().toLowerCase();
        
        return user === correct || 
               user.includes(correct) || 
               this.calculateSimilarity(user, correct) > 0.8;
    }

    checkSolveAnswer(userAnswer, correctAnswer) {
        if (!userAnswer) return { isCorrect: false, percentage: 0 };

        const user = String(userAnswer).trim().toLowerCase();
        const correct = String(correctAnswer).trim().toLowerCase();

        const exactMatch = user === correct;
        if (exactMatch) return { isCorrect: true, percentage: 100 };

        const containsKey = correct.split(' ').every(word => user.includes(word));
        if (containsKey) return { isCorrect: true, percentage: 80 };

        const similarity = this.calculateSimilarity(user, correct);
        if (similarity > 0.7) return { isCorrect: true, percentage: Math.round(similarity * 100) };

        return { isCorrect: false, percentage: Math.round(similarity * 50) };
    }

    evaluateComposition(answer, question) {
        if (!answer || answer.length < 50) {
            return { percentage: 10 };
        }

        const rubric = question.rubric || { content: 30, structure: 15, language: 15 };
        const maxScore = rubric.content + rubric.structure + rubric.language;

        let score = 0;
        const length = answer.length;

        const contentScore = Math.min(rubric.content, (length / 600) * rubric.content);
        score += contentScore;

        const hasStructure = answer.includes('首先') || answer.includes('其次') || 
                           answer.includes('最后') || answer.includes('然而');
        score += hasStructure ? rubric.structure * 0.8 : rubric.structure * 0.3;

        const wordCount = answer.split(/\s+/).length;
        const uniqueWords = new Set(answer.split(/\s+/)).size;
        const vocabScore = Math.min(rubric.language, (uniqueWords / wordCount) * rubric.language);
        score += vocabScore;

        return { 
            percentage: Math.round((score / maxScore) * 100),
            feedback: this.getCompositionFeedback(score / maxScore)
        };
    }

    getCompositionFeedback(percentage) {
        if (percentage >= 0.9) return '优秀！立意深刻，内容丰富，语言优美。';
        if (percentage >= 0.8) return '良好。结构清晰，内容充实。';
        if (percentage >= 0.7) return '中等。基本符合要求，可进一步完善。';
        if (percentage >= 0.6) return '及格。需要加强内容深度和语言表达。';
        return '需要改进。建议重新审题，增加内容。';
    }

    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    calculateSectionScores(details, sections) {
        const sectionScores = [];
        
        sections.forEach(section => {
            const sectionDetails = details.filter(d => 
                section.questions.some(q => q.id === d.questionId)
            );
            
            const score = sectionDetails.reduce((sum, d) => sum + d.score, 0);
            const maxScore = sectionDetails.reduce((sum, d) => sum + d.maxScore, 0);
            
            sectionScores.push({
                name: section.name,
                score,
                maxScore,
                percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
            });
        });
        
        return sectionScores;
    }

    getGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'E';
    }

    getGradeDescription(grade) {
        const descriptions = {
            'A': '优秀',
            'B': '良好',
            'C': '中等',
            'D': '及格',
            'E': '不及格'
        };
        return descriptions[grade] || grade;
    }

    getSubjectName(subject) {
        const names = {
            math: '数学',
            chinese: '语文',
            english: '英语',
            physics: '物理',
            chemistry: '化学',
            biology: '生物',
            history: '历史',
            geography: '地理',
            politics: '政治'
        };
        return names[subject] || subject;
    }

    getExamHistory() {
        return this.examHistory;
    }

    getCurrentExam() {
        return this.currentExam;
    }

    getRemainingTime() {
        if (!this.currentExam) return null;
        
        const elapsed = (Date.now() - this.currentExam.startTime) / 1000;
        const total = this.currentExam.duration * 60;
        const remaining = Math.max(0, total - elapsed);
        
        return {
            remaining: Math.round(remaining),
            total: total,
            percentage: Math.round((remaining / total) * 100)
        };
    }

    cancelExam() {
        if (this.currentExam) {
            this.currentExam = null;
            return true;
        }
        return false;
    }

    generateExamPaper(exam) {
        let content = '';
        
        content += `╔══════════════════════════════════════════╗\n`;
        content += `║         ${exam.title.padEnd(30)}║\n`;
        content += `╠══════════════════════════════════════════╣\n`;
        content += `║ 科目：${this.getSubjectName(exam.subject).padEnd(15)}总分：${String(exam.totalScore).padEnd(8)}分║\n`;
        content += `║ 考试时长：${String(exam.duration).padEnd(5)}分钟${' '.repeat(16)}║\n`;
        content += `╚══════════════════════════════════════════╝\n\n`;

        exam.sections.forEach((section, sIndex) => {
            content += `【${section.name}】（共${section.totalScore}分）\n`;
            content += `${'─'.repeat(40)}\n`;

            section.questions.forEach((q, qIndex) => {
                content += `${sIndex + 1}. ${q.question} (${q.score}分)\n`;

                if (q.type === 'choice' && q.options) {
                    q.options.forEach((opt, i) => {
                        content += `   ${String.fromCharCode(65 + i)}. ${opt}\n`;
                    });
                } else if (q.type === 'fill') {
                    const blankCount = (q.question.match(/____/g) || []).length;
                    for (let i = 0; i < blankCount; i++) {
                        content += `   答案${i + 1}：____________\n`;
                    }
                } else if (q.type === 'judge') {
                    content += `   ✓ 正确    ✗ 错误\n`;
                    content += `   你的答案：______\n`;
                } else if (q.type === 'solve' || q.type === 'composition') {
                    content += `\n   答：\n`;
                    content += `   ${'_'.repeat(35)}\n`;
                    content += `   ${'_'.repeat(35)}\n`;
                    if (q.type === 'composition') {
                        content += `   ${'_'.repeat(35)}\n`;
                        content += `   ${'_'.repeat(35)}\n`;
                        content += `   ${'_'.repeat(35)}\n`;
                    }
                }

                content += '\n';
            });
        });

        return content;
    }

    generateAnswerKey(exam) {
        let content = '【参考答案】\n\n';

        exam.sections.forEach((section, sIndex) => {
            content += `【${section.name}】\n`;

            section.questions.forEach((q, qIndex) => {
                content += `${sIndex + 1}. `;

                if (q.type === 'choice') {
                    const answerLetter = String.fromCharCode(65 + q.answer);
                    content += `答案：${answerLetter} (${q.options[q.answer]})\n`;
                } else if (q.type === 'fill') {
                    content += `答案：${q.answer}\n`;
                } else if (q.type === 'judge') {
                    content += `答案：${q.answer ? '正确' : '错误'}\n`;
                } else if (q.type === 'solve') {
                    content += `\n   参考答案：${q.answer}\n`;
                    if (q.steps) {
                        content += `   解题步骤：\n`;
                        q.steps.forEach(step => {
                            content += `   ${step}\n`;
                        });
                    }
                } else if (q.type === 'composition') {
                    content += `\n   【作文题】见 rubric 评分\n`;
                    content += `   内容：${q.rubric.content}分\n`;
                    content += `   结构：${q.rubric.structure}分\n`;
                    content += `   语言：${q.rubric.language}分\n`;
                }

                content += '\n';
            });
        });

        return content;
    }

    exportToPDF(exam, includeAnswers = false) {
        let content = this.generateExamPaper(exam);
        
        if (includeAnswers) {
            content += '\n\n' + this.generateAnswerKey(exam);
        }

        return content;
    }
}
