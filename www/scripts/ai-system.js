/**
 * AI系统 - 智能NPC行为模拟
 */

export class AISystem {
    constructor() {
        this.studentAIs = {};
        this.teacherAIs = {};
        this.directorAIs = {};
        this.economicAI = null;
    }

    update(deltaTime) {
        this.updateStudents(deltaTime);
        this.updateTeachers(deltaTime);
        this.updateDirectors(deltaTime);
        this.updateEconomic(deltaTime);
    }

    updateStudents(deltaTime) {
        Object.values(this.studentAIs).forEach(studentAI => {
            studentAI.simulate(deltaTime);
        });
    }

    updateTeachers(deltaTime) {
        Object.values(this.teacherAIs).forEach(teacherAI => {
            teacherAI.simulate(deltaTime);
        });
    }

    updateDirectors(deltaTime) {
        Object.values(this.directorAIs).forEach(directorAI => {
            directorAI.simulate(deltaTime);
        });
    }

    updateEconomic(deltaTime) {
        if (this.economicAI) {
            this.economicAI.update(deltaTime);
        }
    }

    createStudentAI(studentData) {
        const ai = new StudentAI(studentData);
        this.studentAIs[studentData.id] = ai;
        return ai;
    }

    createTeacherAI(teacherData) {
        const ai = new TeacherAI(teacherData);
        this.teacherAIs[teacherData.id] = ai;
        return ai;
    }

    createDirectorAI(directorData) {
        const ai = new DirectorAI(directorData);
        this.directorAIs[directorData.id] = ai;
        return ai;
    }

    initEconomicAI(config) {
        this.economicAI = new EconomicAI(config);
    }

    weeklyUpdate() {
        this.updateStudentsWeekly();
        this.updateTeachersWeekly();
        this.updateDirectorsWeekly();
    }

    monthlyUpdate() {
        this.updateStudentsMonthly();
        this.updateTeachersMonthly();
        this.updateDirectorsMonthly();
        this.economicAI?.updateMarket();
    }

    updateStudentsWeekly() {
        Object.values(this.studentAIs).forEach(ai => {
            ai.weeklyUpdate();
        });
    }

    updateTeachersWeekly() {
        Object.values(this.teacherAIs).forEach(ai => {
            ai.weeklyUpdate();
        });
    }

    updateDirectorsWeekly() {
        Object.values(this.directorAIs).forEach(ai => {
            ai.weeklyUpdate();
        });
    }

    updateStudentsMonthly() {
        Object.values(this.studentAIs).forEach(ai => {
            ai.monthlyUpdate();
        });
    }

    updateTeachersMonthly() {
        Object.values(this.teacherAIs).forEach(ai => {
            ai.monthlyUpdate();
        });
    }

    updateDirectorsMonthly() {
        Object.values(this.directorAIs).forEach(ai => {
            ai.monthlyUpdate();
        });
    }

    getData() {
        return {
            studentAIs: Object.keys(this.studentAIs),
            teacherAIs: Object.keys(this.teacherAIs),
            directorAIs: Object.keys(this.directorAIs),
            economicAI: this.economicAI ? this.economicAI.getData() : null
        };
    }

    loadData(data) {
        if (data && data.economicAI) {
            this.economicAI = new EconomicAI(data.economicAI);
        }
    }
}

class StudentAI {
    constructor(studentData) {
        this.id = studentData.id;
        this.name = studentData.name;
        this.grade = studentData.grade || 7;
        this.personality = studentData.personality || 'normal';
        this.scores = studentData.scores || {};
        this.behavior = {
            studyHours: 0,
            socialHours: 0,
            leisureHours: 0
        };
    }

    simulate(deltaTime) {
        this.updateBehavior(deltaTime);
        this.updateLearning(deltaTime);
    }

    updateBehavior(deltaTime) {
        const personalities = {
            diligent: { study: 0.7, social: 0.2, leisure: 0.1 },
            normal: { study: 0.5, social: 0.3, leisure: 0.2 },
            lazy: { study: 0.3, social: 0.3, leisure: 0.4 },
            social: { study: 0.3, social: 0.5, leisure: 0.2 }
        };

        const distribution = personalities[this.personality] || personalities.normal;
        const hourFraction = deltaTime / (5 * 60 * 1000);

        this.behavior.studyHours += hourFraction * distribution.study;
        this.behavior.socialHours += hourFraction * distribution.social;
        this.behavior.leisureHours += hourFraction * distribution.leisure;
    }

    updateLearning(deltaTime) {
        const studyEfficiency = this.getStudyEfficiency();
        const learningGain = (deltaTime / (5 * 60 * 1000)) * studyEfficiency * 0.5;

        Object.keys(this.scores).forEach(subject => {
            this.scores[subject] = Math.min(100, this.scores[subject] + learningGain);
        });
    }

    getStudyEfficiency() {
        const hourThreshold = 3;
        if (this.behavior.studyHours > hourThreshold * 2) {
            return 0.6;
        } else if (this.behavior.studyHours > hourThreshold) {
            return 1.0;
        } else {
            return 1.2;
        }
    }

    weeklyUpdate() {
        this.behavior = { studyHours: 0, socialHours: 0, leisureHours: 0 };
    }

    monthlyUpdate() {
        this.adjustPersonality();
    }

    adjustPersonality() {
        const scoreAvg = Object.values(this.scores).reduce((a, b) => a + b, 0) / Object.values(this.scores).length;
        
        if (scoreAvg > 85 && this.personality === 'normal') {
            this.personality = 'diligent';
        }
    }
}

class TeacherAI {
    constructor(teacherData) {
        this.id = teacherData.id;
        this.name = teacherData.name;
        this.subject = teacherData.subject;
        this.title = teacherData.title || '助教';
        this.workload = {
            lessonsPrepared: 0,
            examsCreated: 0,
            papersGraded: 0
        };
        this.performance = teacherData.performance || 70;
    }

    simulate(deltaTime) {
        this.updateWorkload(deltaTime);
        this.updatePerformance(deltaTime);
    }

    updateWorkload(deltaTime) {
        const dayFraction = deltaTime / (5 * 60 * 1000 * 60);

        this.workload.lessonsPrepared += dayFraction * 0.3;
        this.workload.examsCreated += dayFraction * 0.1;
        this.workload.papersGraded += dayFraction * 0.4;
    }

    updatePerformance(deltaTime) {
        const efficiency = this.getTitleEfficiency();
        const delta = (deltaTime / (5 * 60 * 1000)) * efficiency * 0.1;
        
        this.performance = Math.max(0, Math.min(100, this.performance + delta));
    }

    getTitleEfficiency() {
        const efficiencies = {
            '助教': 0.8,
            '讲师': 1.0,
            '副教授': 1.2,
            '教授': 1.5
        };
        return efficiencies[this.title] || 1.0;
    }

    weeklyUpdate() {
        this.workload = { lessonsPrepared: 0, examsCreated: 0, papersGraded: 0 };
    }

    monthlyUpdate() {
        this.evaluatePerformance();
    }

    evaluatePerformance() {
        const workloadScore = Math.min(100, this.workload.lessonsPrepared * 10);
        const qualityScore = this.performance;
        
        return {
            workload: Math.round(workloadScore),
            quality: Math.round(qualityScore),
            overall: Math.round((workloadScore + qualityScore) / 2)
        };
    }
}

class DirectorAI {
    constructor(directorData) {
        this.id = directorData.id;
        this.name = directorData.name;
        this.department = directorData.department;
        this.efficiency = directorData.efficiency || 80;
        this.decisions = [];
    }

    simulate(deltaTime) {
        this.processDailyTasks();
        this.makeDecisions();
    }

    processDailyTasks() {
        const taskEfficiency = this.efficiency / 100;
        const tasksCompleted = Math.random() * taskEfficiency;
        
        return tasksCompleted > 0.7;
    }

    makeDecisions() {
        const decisionTypes = ['allocate_resources', 'resolve_issue', 'plan_event'];
        const decision = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
        
        this.decisions.push({
            type: decision,
            timestamp: Date.now(),
            outcome: this.evaluateDecision(decision)
        });

        if (this.decisions.length > 100) {
            this.decisions.shift();
        }
    }

    evaluateDecision(decision) {
        const baseProbability = 0.7;
        const skillBonus = (this.efficiency - 80) / 100 * 0.2;
        return Math.random() < (baseProbability + skillBonus) ? 'success' : 'improvement_needed';
    }

    generateReport() {
        return {
            department: this.department,
            efficiency: this.efficiency,
            recentDecisions: this.decisions.slice(-5),
            performance: this.evaluatePerformance()
        };
    }

    weeklyUpdate() {
        this.adjustEfficiency();
    }

    monthlyUpdate() {
        this.evaluateMonthly();
    }

    adjustEfficiency() {
        const randomFactor = (Math.random() - 0.5) * 5;
        this.efficiency = Math.max(60, Math.min(100, this.efficiency + randomFactor));
    }

    evaluatePerformance() {
        const successRate = this.decisions.filter(d => d.outcome === 'success').length / this.decisions.length;
        return {
            efficiency: Math.round(this.efficiency),
            successRate: Math.round(successRate * 100),
            overall: Math.round((this.efficiency + successRate * 100) / 2)
        };
    }
}

class EconomicAI {
    constructor(config = {}) {
        this.market = config.market || {
            supply: 100,
            demand: 100,
            inflation: 1.0
        };
        this.prices = config.prices || {
            salary: 8000,
            facility: 50000,
            material: 1000
        };
        this.cycle = 0;
    }

    update(deltaTime) {
        this.cycle += deltaTime / (5 * 60 * 1000);
        
        if (this.cycle >= 30) {
            this.adjustPrices();
            this.cycle = 0;
        }
    }

    updateMarket() {
        const supplyDelta = (Math.random() - 0.5) * 10;
        const demandDelta = (Math.random() - 0.5) * 10;
        
        this.market.supply = Math.max(50, Math.min(150, this.market.supply + supplyDelta));
        this.market.demand = Math.max(50, Math.min(150, this.market.demand + demandDelta));

        this.calculateInflation();
    }

    adjustPrices() {
        const marketRatio = this.market.demand / this.market.supply;
        
        Object.keys(this.prices).forEach(key => {
            const adjustment = marketRatio * (Math.random() * 0.1 - 0.05);
            this.prices[key] *= (1 + adjustment);
            this.prices[key] = Math.round(this.prices[key] * 100) / 100;
        });
    }

    calculateInflation() {
        const imbalance = Math.abs(this.market.demand - this.market.supply) / 100;
        this.market.inflation = 1.0 + imbalance * 0.5;
    }

    getData() {
        return {
            market: this.market,
            prices: this.prices,
            cycle: this.cycle
        };
    }

    getPrice(item) {
        return this.prices[item] || 1000;
    }
}
