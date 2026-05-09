/**
 * 校长类 - 校长角色逻辑
 */

export class Principal {
    constructor(data = {}) {
        this.type = 'principal';
        this.id = data.id || this.generateId();
        this.name = data.name || '校长';
        this.avatar = data.avatar || '👨‍💼';
        
        this.managedDepartment = data.managedDepartment || 'academic';
        this.schoolLevel = data.schoolLevel || 1;
        this.reputation = data.reputation || 50;
        
        this.funds = data.funds || 1000000;
        this.departments = data.departments || this.initDepartments();
        this.directors = data.directors || {};
        
        this.statistics = data.statistics || {
            termsServed: 0,
            policiesImplemented: 0,
            teachersRecruited: 0,
            studentsGraduated: 0
        };
    }

    generateId() {
        return 'principal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initDepartments() {
        return {
            academic: { name: '教务处', efficiency: 80, staff: 7 },
            student: { name: '政教处', efficiency: 80, staff: 6 },
            logistics: { name: '总务处', efficiency: 80, staff: 22 },
            research: { name: '教研室', efficiency: 80, staff: 9 },
            office: { name: '办公室', efficiency: 80, staff: 6 },
            finance: { name: '财务处', efficiency: 80, staff: 4 }
        };
    }

    getData() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            managedDepartment: this.managedDepartment,
            schoolLevel: this.schoolLevel,
            reputation: this.reputation,
            funds: this.funds,
            departments: this.departments,
            directors: this.directors,
            statistics: this.statistics
        };
    }

    update(deltaTime) {
        this.reputation = Math.max(0, Math.min(100, this.reputation));
        this.funds = Math.max(0, this.funds);
    }

    manageDepartment(deptId) {
        if (!this.departments[deptId]) {
            return { success: false, message: '部门不存在' };
        }

        this.managedDepartment = deptId;
        return { success: true, department: this.departments[deptId] };
    }

    appointDirector(deptId, director) {
        if (!this.departments[deptId]) {
            return { success: false, message: '部门不存在' };
        }

        this.directors[deptId] = {
            ...director,
            appointedAt: Date.now()
        };

        this.departments[deptId].efficiency += 10;

        return {
            success: true,
            director: this.directors[deptId]
        };
    }

    recruitDirector(deptId, source = 'random') {
        const director = this.generateDirector(source);
        return this.appointDirector(deptId, director);
    }

    generateDirector(source) {
        const names = ['张建国', '王秀英', '李志刚', '周芳', '陈明', '刘强', '孙丽', '赵伟'];
        const specialties = ['教学管理', '师资培训', '行政协调', '学生管理', '财务管理', '后勤保障'];
        const personalities = ['稳重务实', '雷厉风行', '温和细腻', '创新进取', '严谨认真'];

        const director = {
            name: names[Math.floor(Math.random() * names.length)],
            age: 35 + Math.floor(Math.random() * 15),
            education: '硕士',
            specialty: specialties[Math.floor(Math.random() * specialties.length)],
            personality: personalities[Math.floor(Math.random() * personalities.length)],
            leadership: 60 + Math.floor(Math.random() * 30),
            management: 60 + Math.floor(Math.random() * 30),
            execution: 60 + Math.floor(Math.random() * 30),
            coordination: 60 + Math.floor(Math.random() * 30),
            innovation: 50 + Math.floor(Math.random() * 40),
            stability: 70 + Math.floor(Math.random() * 25)
        };

        if (source === 'teacher') {
            director.fromTeacher = true;
            director.originalSubject = '数学';
            director.teachingYears = 5;
        }

        return director;
    }

    approveBudget(expense) {
        if (expense.amount > this.funds) {
            return { success: false, message: '资金不足' };
        }

        const approvalLimit = this.getApprovalLimit();
        if (expense.amount > approvalLimit) {
            return {
                success: false,
                message: `超过审批限额${approvalLimit}元，需要上级审批`
            };
        }

        this.funds -= expense.amount;
        return { success: true, remaining: this.funds };
    }

    getApprovalLimit() {
        const limits = {
            1: 50000,
            2: 100000,
            3: 200000,
            4: 500000,
            5: 1000000
        };
        return limits[this.schoolLevel] || 50000;
    }

    setSchoolPolicy(policy) {
        this.statistics.policiesImplemented++;

        const policyEffects = {
            enrollment: () => { this.reputation += 5; },
            facility: () => {
                this.departments.logistics.efficiency += 5;
            },
            teaching: () => {
                this.departments.academic.efficiency += 5;
            },
            student_welfare: () => {
                this.departments.student.efficiency += 5;
            }
        };

        if (policyEffects[policy.type]) {
            policyEffects[policy.type]();
        }

        return {
            success: true,
            policy: policy,
            effects: this.getPolicyEffects(policy)
        };
    }

    getPolicyEffects(policy) {
        const effects = {
            enrollment: { reputation: '+5' },
            facility: { '总务处效率': '+5' },
            teaching: { '教务处效率': '+5' },
            student_welfare: { '政教处效率': '+5' }
        };
        return effects[policy.type] || {};
    }

    upgradeSchool() {
        const upgradeCost = this.calculateUpgradeCost();
        const requirements = this.getUpgradeRequirements();

        if (this.funds < upgradeCost) {
            return { success: false, message: '资金不足' };
        }

        const metRequirements = requirements.filter(req => {
            if (req.type === 'reputation') return this.reputation >= req.value;
            if (req.type === 'funds') return this.funds >= req.value;
            if (req.type === 'director') return !!this.directors[req.dept];
            return false;
        });

        if (metRequirements.length < requirements.length) {
            return {
                success: false,
                message: '条件未满足',
                requirements: requirements,
                met: metRequirements
            };
        }

        this.funds -= upgradeCost;
        this.schoolLevel++;

        return {
            success: true,
            newLevel: this.schoolLevel,
            message: `学校已升级为${this.getLevelName()}！`
        };
    }

    calculateUpgradeCost() {
        return this.schoolLevel * 1000000;
    }

    getUpgradeRequirements() {
        const baseRequirements = [
            { type: 'reputation', value: 50 + this.schoolLevel * 10, name: '声誉值' },
            { type: 'funds', value: this.schoolLevel * 800000, name: '资金储备' }
        ];

        if (this.schoolLevel >= 2) {
            baseRequirements.push({
                type: 'director',
                dept: 'academic',
                name: '教务主任'
            });
        }

        if (this.schoolLevel >= 3) {
            baseRequirements.push({
                type: 'director',
                dept: 'student',
                name: '政教主任'
            });
        }

        return baseRequirements;
    }

    getLevelName() {
        const names = {
            1: '普通中学',
            2: '重点中学',
            3: '示范中学',
            4: '优秀示范校',
            5: '顶尖名校'
        };
        return names[this.schoolLevel] || `Level ${this.schoolLevel}`;
    }

    updateDepartmentEfficiency(deptId, delta) {
        if (this.departments[deptId]) {
            this.departments[deptId].efficiency = Math.max(0, Math.min(100,
                this.departments[deptId].efficiency + delta
            ));
        }
    }

    getOverallEfficiency() {
        const depts = Object.values(this.departments);
        const total = depts.reduce((sum, dept) => sum + dept.efficiency, 0);
        return Math.round(total / depts.length);
    }

    getFinancialStatus() {
        return {
            total: this.funds,
            monthlyIncome: this.calculateMonthlyIncome(),
            monthlyExpense: this.calculateMonthlyExpense(),
            balance: this.calculateMonthlyIncome() - this.calculateMonthlyExpense()
        };
    }

    calculateMonthlyIncome() {
        const baseIncome = this.schoolLevel * 100000;
        const reputationBonus = Math.floor(this.reputation / 10) * 10000;
        return baseIncome + reputationBonus;
    }

    calculateMonthlyExpense() {
        const staffExpense = Object.values(this.departments).reduce(
            (sum, dept) => sum + dept.staff * 3000, 0
        );
        const facilityExpense = this.schoolLevel * 20000;
        return staffExpense + facilityExpense;
    }
}
