/**
 * 体育课系统 - 管理体育课活动和运动会
 */

export class PhysicalEducationSystem {
    constructor() {
        this.currentClass = null;
        this.sports = this.initSports();
        this.records = [];
    }

    initSports() {
        return {
            running: {
                name: '跑步',
                icon: '🏃',
                types: ['100米', '200米', '400米', '800米', '1000米', '1500米', '接力赛'],
                skills: ['速度', '耐力', '爆发力'],
                training: ['热身跑', '冲刺练习', '耐力跑', '间歇训练']
            },
            jumping: {
                name: '跳跃',
                icon: '🦘',
                types: ['跳远', '三级跳远', '跳高', '撑杆跳'],
                skills: ['弹跳力', '协调性', '爆发力'],
                training: ['深蹲跳', '跨步跳', '弹跳板练习']
            },
            throwing: {
                name: '投掷',
                icon: '🎯',
                types: ['铅球', '铁饼', '标枪', '实心球'],
                skills: ['力量', '协调性', '技巧'],
                training: ['力量训练', '技术动作', '投掷练习']
            },
            ball: {
                name: '球类',
                icon: '🏀',
                types: ['篮球', '足球', '排球', '羽毛球', '乒乓球', '网球'],
                skills: ['技巧', '团队配合', '反应速度'],
                training: ['基础运球', '传球配合', '投篮/射门练习', '对抗赛']
            },
            gymnastics: {
                name: '体操',
                icon: '🤸',
                types: ['单杠', '双杠', '跳马', '自由体操'],
                skills: ['柔韧性', '力量', '平衡感'],
                training: ['热身拉伸', '基础动作', '组合练习']
            },
            swimming: {
                name: '游泳',
                icon: '🏊',
                types: ['自由泳', '仰泳', '蛙泳', '蝶泳', '混合泳'],
                skills: ['耐力', '肺活量', '协调性'],
                training: ['热身拉伸', '呼吸练习', '泳姿练习', '耐力训练']
            }
        };
    }

    startClass(config) {
        const classSession = {
            id: 'pe_' + Date.now(),
            type: config.type || 'training',
            sport: config.sport || 'running',
            date: Date.now(),
            duration: config.duration || 45,
            participants: config.participants || [],
            activities: [],
            status: 'in_progress',
            teacher: config.teacher || null,
            weather: this.getRandomWeather(),
            energyCost: 15
        };

        this.currentClass = classSession;
        return classSession;
    }

    getRandomWeather() {
        const weathers = [
            { name: '晴', icon: '☀️', effect: 1.0 },
            { name: '多云', icon: '⛅', effect: 1.0 },
            { name: '阴', icon: '☁️', effect: 0.95 },
            { name: '小雨', icon: '🌧️', effect: 0.8 },
            { name: '炎热', icon: '🔥', effect: 0.85 }
        ];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }

    addActivity(activity) {
        if (!this.currentClass) return null;

        const newActivity = {
            id: 'act_' + Date.now(),
            name: activity.name,
            type: activity.type || 'training',
            duration: activity.duration || 10,
            intensity: activity.intensity || 'medium',
            energyCost: activity.energyCost || 5,
            score: null,
            feedback: null
        };

        this.currentClass.activities.push(newActivity);
        return newActivity;
    }

    startActivity(activityId) {
        const activity = this.currentClass?.activities.find(a => a.id === activityId);
        if (activity) {
            activity.startedAt = Date.now();
            return activity;
        }
        return null;
    }

    completeActivity(activityId, result) {
        const activity = this.currentClass?.activities.find(a => a.id === activityId);
        if (!activity) return null;

        activity.completedAt = Date.now();
        activity.score = result.score || this.calculateScore(result);
        activity.feedback = result.feedback || '';
        activity.performance = result.performance || 'good';

        return activity;
    }

    calculateScore(result) {
        let baseScore = 60;

        if (result.performance === 'excellent') baseScore += 30;
        else if (result.performance === 'good') baseScore += 20;
        else if (result.performance === 'average') baseScore += 10;

        if (result.personalBest) baseScore += 10;

        baseScore += (result.effort || 5) * 2;

        return Math.min(100, baseScore);
    }

    finishClass() {
        if (!this.currentClass) return null;

        this.currentClass.status = 'completed';
        this.currentClass.finishedAt = Date.now();

        const totalScore = this.currentClass.activities.reduce((sum, a) => sum + (a.score || 0), 0);
        const avgScore = this.currentClass.activities.length > 0 
            ? totalScore / this.currentClass.activities.length 
            : 0;

        this.currentClass.summary = {
            totalActivities: this.currentClass.activities.length,
            completedActivities: this.currentClass.activities.filter(a => a.completedAt).length,
            avgScore: Math.round(avgScore),
            totalDuration: this.currentClass.activities.reduce((sum, a) => sum + a.duration, 0),
            performance: this.getClassPerformance(avgScore)
        };

        const record = { ...this.currentClass };
        this.records.push(record);

        const finished = this.currentClass;
        this.currentClass = null;

        return finished;
    }

    getClassPerformance(avgScore) {
        if (avgScore >= 90) return '卓越';
        if (avgScore >= 80) return '优秀';
        if (avgScore >= 70) return '良好';
        if (avgScore >= 60) return '及格';
        return '需要加强';
    }

    getTrainingProgram(sport, level) {
        const sportData = this.sports[sport];
        if (!sportData) return [];

        const programs = {
            beginner: [
                { name: '热身运动', duration: 10, intensity: 'low', description: '慢跑和关节活动' },
                { name: '基础训练', duration: 15, intensity: 'medium', description: sportData.training[0] },
                { name: '技能练习', duration: 15, intensity: 'medium', description: sportData.training[1] || '基础动作' },
                { name: '放松整理', duration: 5, intensity: 'low', description: '拉伸放松' }
            ],
            intermediate: [
                { name: '热身运动', duration: 8, intensity: 'medium', description: '动态热身' },
                { name: '技术训练', duration: 18, intensity: 'high', description: sportData.training[1] || '强化练习' },
                { name: '对抗练习', duration: 12, intensity: 'high', description: sportData.training[2] || '实战演练' },
                { name: '体能训练', duration: 7, intensity: 'high', description: `${sportData.skills[0]}强化` },
                { name: '放松整理', duration: 5, intensity: 'low', description: '静态拉伸' }
            ],
            advanced: [
                { name: '专项热身', duration: 10, intensity: 'high', description: '技术准备活动' },
                { name: '高强度训练', duration: 15, intensity: 'very_high', description: sportData.training[2] || '极限挑战' },
                { name: '模拟比赛', duration: 12, intensity: 'very_high', description: '实战对抗' },
                { name: '技术优化', duration: 8, intensity: 'high', description: '细节打磨' },
                { name: '恢复训练', duration: 5, intensity: 'medium', description: '积极恢复' }
            ]
        };

        return programs[level] || programs.beginner;
    }

    recordPersonalBest(sport, event, result) {
        const record = {
            id: 'pb_' + Date.now(),
            sport,
            event,
            result,
            achievedAt: Date.now(),
            previousRecord: null
        };

        return record;
    }

    getRecords(filter = {}) {
        let result = [...this.records];
        
        if (filter.sport) {
            result = result.filter(r => r.sport === filter.sport);
        }
        
        if (filter.date) {
            result = result.filter(r => {
                const recordDate = new Date(r.date).toDateString();
                return recordDate === new Date(filter.date).toDateString();
            });
        }

        return result.sort((a, b) => b.date - a.date);
    }

    getSkillLevel(player, sport) {
        const sportData = this.sports[sport];
        if (!sportData) return { level: 1, progress: 0, exp: 0 };

        const playerSports = player.sportsSkills || {};
        const skill = playerSports[sport] || { level: 1, exp: 0, skills: {} };

        const expNeeded = skill.level * 100;
        const progress = (skill.exp / expNeeded) * 100;

        return {
            level: skill.level,
            exp: skill.exp,
            expNeeded,
            progress: Math.min(100, progress),
            skills: skill.skills || {}
        };
    }

    addExperience(player, sport, exp) {
        if (!player.sportsSkills) player.sportsSkills = {};
        if (!player.sportsSkills[sport]) {
            player.sportsSkills[sport] = { level: 1, exp: 0, skills: {} };
        }

        const skill = player.sportsSkills[sport];
        skill.exp += exp;

        const expNeeded = skill.level * 100;
        while (skill.exp >= expNeeded) {
            skill.exp -= expNeeded;
            skill.level++;
        }

        return skill;
    }

    getSportStats() {
        const stats = {};
        
        Object.keys(this.sports).forEach(sport => {
            const sportRecords = this.records.filter(r => r.sport === sport);
            if (sportRecords.length > 0) {
                const avgScore = sportRecords.reduce((sum, r) => {
                    return sum + (r.summary?.avgScore || 0);
                }, 0) / sportRecords.length;

                stats[sport] = {
                    totalClasses: sportRecords.length,
                    avgScore: Math.round(avgScore),
                    lastActivity: sportRecords[0]?.date,
                    bestScore: Math.max(...sportRecords.map(r => r.summary?.avgScore || 0))
                };
            }
        });

        return stats;
    }

    generateReport(player) {
        const stats = this.getSportStats();
        const overallAvg = Object.values(stats).reduce((sum, s) => sum + s.avgScore, 0) / 
                          (Object.keys(stats).length || 1);

        let report = '';
        report += `╔════════════════════════════════════════════╗\n`;
        report += `║         🏃 体育成绩报告单 🏃              ║\n`;
        report += `╠════════════════════════════════════════════╣\n`;
        report += `║ 姓名：${player.name.padEnd(20)}║\n`;
        report += `║ 综合评价：${this.getClassPerformance(overallAvg).padEnd(14)} (${Math.round(overallAvg)}分)  ║\n`;
        report += `╚════════════════════════════════════════════╝\n\n`;

        report += `【各项目成绩】\n`;
        Object.entries(stats).forEach(([sport, data]) => {
            const sportInfo = this.sports[sport];
            report += `${sportInfo?.icon || '•'} ${sportInfo?.name || sport}: ${data.avgScore}分\n`;
            report += `   参与次数: ${data.totalClasses}次 | 最高分: ${data.bestScore}分\n`;
        });

        report += `\n【技能等级】\n`;
        Object.entries(player.sportsSkills || {}).forEach(([sport, skill]) => {
            const sportInfo = this.sports[sport];
            report += `${sportInfo?.icon || '•'} ${sportInfo?.name || sport}: Lv.${skill.level}\n`;
        });

        return report;
    }
}
