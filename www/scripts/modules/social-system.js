/**
 * 社交系统 - 管理NPC、社交关系、社团和班干部
 */

export class SocialSystem {
    constructor() {
        this.npcs = this.initNPCs();
        this.relationships = {};
        this.clubs = this.initClubs();
        this.clubMembers = {};
        this.classOfficers = this.initClassOfficers();
        this.activities = this.initActivities();
        this.friendRequests = [];
    }

    initNPCs() {
        return {
            classmates: [
                { id: 'li_yu', name: '林小雨', avatar: '👧', personality: '开朗热心', specialty: '英语', birthday: '3月15日', traits: ['乐群', '勤奋'] },
                { id: 'zhang_wei', name: '张伟', avatar: '😎', personality: '沉稳聪明', specialty: '数学物理', birthday: '8月22日', traits: ['冷静', '逻辑'] },
                { id: 'wang_mei', name: '王美', avatar: '🎨', personality: '文艺细腻', specialty: '美术', birthday: '11月3日', traits: ['创意', '敏感'] },
                { id: 'li_hua', name: '李华', avatar: '👦', personality: '活泼好动', specialty: '体育', birthday: '5月18日', traits: ['活力', '义气'] },
                { id: 'zhao_qiang', name: '赵强', avatar: '😼', personality: '幽默风趣', specialty: '计算机', birthday: '2月28日', traits: ['幽默', '机智'] },
                { id: 'sun_na', name: '孙娜', avatar: '👩', personality: '温柔安静', specialty: '音乐', birthday: '7月12日', traits: ['温柔', '细腻'] },
                { id: 'wu_jie', name: '吴杰', avatar: '🧑', personality: '直爽豪迈', specialty: '体育', birthday: '10月5日', traits: ['豪爽', '仗义'] }
            ],
            teachers: [
                { id: 'wang_math', name: '王老师', avatar: '👨‍🏫', subject: '数学', personality: '严谨但和蔼', age: 38, title: '高级教师' },
                { id: 'li_chinese', name: '李老师', avatar: '👩‍🏫', subject: '语文', personality: '温柔负责', age: 35, title: '一级教师' },
                { id: 'zhang_english', name: '张老师', avatar: '👨‍🏫', subject: '英语', personality: '活力十足', age: 32, title: '二级教师' },
                { id: 'chen_pe', name: '陈老师', avatar: '👨‍🏫', subject: '体育', personality: '开朗健谈', age: 40, title: '高级教师' }
            ],
            family: [
                { id: 'father', name: '爸爸', avatar: '👨', personality: '严厉但关爱', job: '工程师', age: 42, hobbies: ['下棋', '钓鱼'] },
                { id: 'mother', name: '妈妈', avatar: '👩', personality: '温柔细心', job: '教师', age: 40, hobbies: ['烹饪', '园艺'] },
                { id: 'sister', name: '妹妹', avatar: '👧', personality: '活泼可爱', age: 10, hobbies: ['画画', '跳舞'] }
            ]
        };
    }

    initClubs() {
        return {
            sports: {
                id: 'sports',
                name: '体育社',
                icon: '⚽',
                description: '强身健体，追逐梦想',
                activities: ['晨跑', '球类训练', '体能挑战'],
                maxMembers: 30,
                requirements: ['体育达标'],
                benefits: ['体力上限+10', '体育成绩+15%'],
                president: null,
                vicePresident: null,
                members: []
            },
            art: {
                id: 'art',
                name: '美术社',
                icon: '🎨',
                description: '发现美，创造美',
                activities: ['写生', '绘画比赛', '展览参观'],
                maxMembers: 25,
                requirements: ['美术基础'],
                benefits: ['审美能力+20', '创作灵感+15%'],
                president: null,
                vicePresident: null,
                members: []
            },
            music: {
                id: 'music',
                name: '音乐社',
                icon: '🎵',
                description: '唱响青春，奏响未来',
                activities: ['合唱排练', '乐器练习', '音乐会'],
                maxMembers: 20,
                requirements: ['音乐兴趣'],
                benefits: ['魅力+15', '压力释放+20%'],
                president: null,
                vicePresident: null,
                members: []
            },
            science: {
                id: 'science',
                name: '科技社',
                icon: '🔬',
                description: '探索未知，创新未来',
                activities: ['实验探究', '科技竞赛', '项目研发'],
                maxMembers: 25,
                requirements: ['理科兴趣'],
                benefits: ['理科能力+15%', '创新能力+20'],
                president: null,
                vicePresident: null,
                members: []
            },
            literature: {
                id: 'literature',
                name: '文学社',
                icon: '📚',
                description: '阅读经典，书写人生',
                activities: ['读书会', '写作坊', '诗词朗诵'],
                maxMembers: 30,
                requirements: ['语文基础'],
                benefits: ['语文能力+15%', '写作技巧+20'],
                president: null,
                vicePresident: null,
                members: []
            },
            volunteer: {
                id: 'volunteer',
                name: '志愿者社',
                icon: '❤️',
                description: '奉献爱心，传递温暖',
                activities: ['社区服务', '公益活动', '爱心捐赠'],
                maxMembers: 40,
                requirements: ['热心公益'],
                benefits: ['社交能力+20', '声望+15'],
                president: null,
                vicePresident: null,
                members: []
            }
        };
    }

    initClassOfficers() {
        return {
            classMonitor: { title: '班长', icon: '🎖️', responsibilities: '班级管理、老师沟通', requirements: ['成绩优秀', '组织能力强'], current: null, candidates: [] },
            studyLeader: { title: '学习委员', icon: '📖', responsibilities: '作业收发、学习监督', requirements: ['成绩良好', '认真负责'], current: null, candidates: [] },
            PELeader: { title: '体育委员', icon: '🏃', responsibilities: '体育活动组织', requirements: ['体育优秀', '活跃开朗'], current: null, candidates: [] },
            activityLeader: { title: '文艺委员', icon: '🎭', responsibilities: '文艺活动组织', requirements: ['文艺特长', '有创意'], current: null, candidates: [] },
            subjectReps: {}
        };
    }

    initActivities() {
        return {
            chat: { name: '聊天', icon: '💬', energy: 0, mood: 5, intimacy: 3, duration: 5 },
            studyTogether: { name: '一起学习', icon: '📚', energy: -15, mood: 8, intimacy: 5, score: 3, duration: 30 },
            playGames: { name: '玩游戏', icon: '🎮', energy: -10, mood: 12, intimacy: 4, duration: 20 },
            haveMeal: { name: '一起吃饭', icon: '🍽️', energy: -5, mood: 10, intimacy: 8, duration: 30 },
            exercise: { name: '一起运动', icon: '⚽', energy: -20, mood: 15, intimacy: 6, score: 5, duration: 45 },
            shopping: { name: '逛街', icon: '🛍️', energy: -15, mood: 18, intimacy: 10, cost: 100, duration: 60 },
            watchMovie: { name: '看电影', icon: '🎬', energy: -5, mood: 15, intimacy: 12, cost: 50, duration: 90 },
            help: { name: '帮忙', icon: '🤝', energy: -10, mood: 8, intimacy: 8, duration: 15 },
            confide: { name: '倾诉', icon: '💭', energy: 0, mood: 15, intimacy: 15, duration: 20 }
        };
    }

    getNPC(category, id) {
        const categoryNPCs = this.npcs[category] || [];
        return categoryNPCs.find(npc => npc.id === id);
    }

    getNPCsByCategory(category) {
        return this.npcs[category] || [];
    }

    interact(targetId, action, playerData) {
        const [category, npcId] = targetId.split(':');
        const npc = this.getNPC(category, npcId);
        
        if (!npc) {
            return { success: false, message: '对象不存在' };
        }

        const activity = this.activities[action] || this.activities.chat;
        
        const result = {
            success: true,
            npc,
            activity: activity.name,
            effects: {
                energy: activity.energy,
                mood: activity.mood,
                intimacy: activity.intimacy,
                score: activity.score || 0,
                cost: activity.cost || 0
            },
            message: this.generateInteractionMessage(npc, activity)
        };
        
        this.updateRelationship(targetId, activity.intimacy);
        return result;
    }

    generateInteractionMessage(npc, activity) {
        const messages = {
            chat: [`和${npc.name}聊了聊天，感觉很开心`, `和${npc.name}聊得很投机`, `${npc.name}分享了一些有趣的事情`],
            studyTogether: [`和${npc.name}一起学习了段时间，收获不少`, `和${npc.name}互相帮助，共同进步`],
            playGames: [`和${npc.name}玩得很开心`, `${npc.name}的游戏技术真不错`],
            haveMeal: [`和${npc.name}一起吃了顿饭，关系更近了`, `${npc.name}推荐的餐厅很不错`],
            exercise: [`和${npc.name}一起运动，酣畅淋漓`, `和${npc.name}进行了一场友谊赛`],
            shopping: [`和${npc.name}逛了一下午`, `${npc.name}的审美很不错`],
            watchMovie: [`和${npc.name}看了场电影`, `${npc.name}选的这部电影很有深度`],
            help: [`帮${npc.name}解决了问题，很有成就感`, `${npc.name}很感谢你的帮助`],
            confide: [`把心里话告诉${npc.name}，轻松了很多`, `${npc.name}给了你很好的建议`]
        };

        const msgList = messages[activity.name === '聊天' ? 'chat' : activity.name.replace('一起', '').replace('🎮', '')] || messages.chat;
        return msgList[Math.floor(Math.random() * msgList.length)];
    }

    updateRelationship(targetId, delta) {
        if (!this.relationships[targetId]) {
            this.relationships[targetId] = 50;
        }

        this.relationships[targetId] = Math.max(0, Math.min(100, 
            this.relationships[targetId] + delta
        ));
    }

    getRelationshipLevel(value) {
        if (value >= 91) return '挚友';
        if (value >= 71) return '知己';
        if (value >= 51) return '朋友';
        if (value >= 31) return '熟人';
        return '同学';
    }

    getRelationship(targetId) {
        const value = this.relationships[targetId] || 50;
        return {
            value,
            level: this.getRelationshipLevel(value)
        };
    }

    joinClub(clubId, playerId) {
        const club = this.clubs[clubId];
        if (!club) return { success: false, message: '社团不存在' };

        if (club.members.includes(playerId)) {
            return { success: false, message: '已经加入了该社团' };
        }

        if (club.members.length >= club.maxMembers) {
            return { success: false, message: '社团人数已满' };
        }

        club.members.push(playerId);
        return { success: true, message: `成功加入${club.name}！` };
    }

    leaveClub(clubId, playerId) {
        const club = this.clubs[clubId];
        if (!club) return { success: false, message: '社团不存在' };

        const index = club.members.indexOf(playerId);
        if (index === -1) {
            return { success: false, message: '你还没有加入该社团' };
        }

        club.members.splice(index, 1);

        if (club.president === playerId) club.president = null;
        if (club.vicePresident === playerId) club.vicePresident = null;

        return { success: true, message: `已退出${club.name}` };
    }

    getPlayerClubs(playerId) {
        return Object.values(this.clubs).filter(club => 
            club.members.includes(playerId)
        );
    }

    getClubInfo(clubId) {
        return this.clubs[clubId];
    }

    runForOffice(position, playerId, playerName) {
        if (!this.classOfficers[position]) {
            return { success: false, message: '职位不存在' };
        }

        const office = this.classOfficers[position];
        if (office.current === playerId) {
            return { success: false, message: '你已经是该职位了' };
        }

        const existing = office.candidates.find(c => c.id === playerId);
        if (existing) {
            return { success: false, message: '已经在候选人名单中了' };
        }

        office.candidates.push({
            id: playerId,
            name: playerName,
            votes: 0,
            campaign: '我会努力做好这份工作'
        });

        return { success: true, message: `成功报名${office.title}职位！` };
    }

    vote(position, voterId, candidateId) {
        const office = this.classOfficers[position];
        if (!office) return { success: false, message: '职位不存在' };

        const candidate = office.candidates.find(c => c.id === candidateId);
        if (!candidate) return { success: false, message: '候选人不存在' };

        if (!candidate.voters) candidate.voters = [];
        if (candidate.voters.includes(voterId)) {
            return { success: false, message: '已经投过票了' };
        }

        candidate.votes++;
        candidate.voters.push(voterId);

        return { success: true, message: '投票成功！' };
    }

    getOfficers() {
        return {
            positions: this.classOfficers,
            allCandidates: Object.values(this.classOfficers).flatMap(o => o.candidates || [])
        };
    }

    sendFriendRequest(fromId, fromName, toId) {
        const existing = this.friendRequests.find(r => 
            r.from === fromId && r.to === toId && r.status === 'pending'
        );

        if (existing) {
            return { success: false, message: '已经发送过好友请求了' };
        }

        const request = {
            id: 'req_' + Date.now(),
            from: fromId,
            fromName,
            to: toId,
            status: 'pending',
            createdAt: Date.now()
        };

        this.friendRequests.push(request);
        return { success: true, message: '好友请求已发送', request };
    }

    acceptFriendRequest(requestId) {
        const request = this.friendRequests.find(r => r.id === requestId);
        if (!request) return { success: false, message: '请求不存在' };
        if (request.status !== 'pending') return { success: false, message: '请求已处理' };

        request.status = 'accepted';
        this.updateRelationship(`classmates:${request.from}`, 20);

        return { success: true, message: '已成为好友！' };
    }

    rejectFriendRequest(requestId) {
        const request = this.friendRequests.find(r => r.id === requestId);
        if (!request) return { success: false, message: '请求不存在' };

        request.status = 'rejected';
        return { success: true, message: '已拒绝好友请求' };
    }

    getPendingRequests(playerId) {
        return this.friendRequests.filter(r => r.to === playerId && r.status === 'pending');
    }

    getFriends(playerId) {
        return Object.entries(this.relationships)
            .filter(([id, value]) => value >= 60 && id.includes(playerId.split(':')[0]))
            .map(([id, value]) => {
                const [category, npcId] = id.split(':');
                const npc = this.getNPC(category, npcId);
                return npc ? { ...npc, intimacy: value } : null;
            })
            .filter(Boolean);
    }

    triggerRandomEvent(playerData) {
        const events = [
            {
                type: 'friend_request',
                category: 'classmates',
                message: '有同学想和你交朋友',
                rarity: 'common'
            },
            {
                type: 'study_invite',
                category: 'classmates',
                message: '林小雨邀请你周末一起学习',
                rarity: 'common'
            },
            {
                type: 'club_invite',
                message: '美术社邀请你加入',
                rarity: 'rare',
                action: 'joinClub'
            },
            {
                type: 'competition',
                message: '数学竞赛即将举行，是否报名？',
                rarity: 'rare',
                action: 'competition'
            },
            {
                type: 'praise',
                category: 'teachers',
                message: '王老师在课堂上表扬了你',
                effect: { mood: 10, relationship: 5 },
                rarity: 'common',
                auto: true
            },
            {
                type: 'birthday',
                category: 'classmates',
                message: '今天是张伟的生日！',
                rarity: 'special',
                action: 'gift'
            },
            {
                type: 'family_event',
                message: '周末家庭聚会',
                rarity: 'common',
                auto: true
            },
            {
                type: 'election',
                message: '班长选举开始，你愿意参加竞选吗？',
                rarity: 'rare',
                action: 'runForOffice'
            }
        ];

        const weights = { common: 60, rare: 25, special: 15 };
        const rand = Math.random() * 100;
        let selectedType = 'common';

        if (rand < weights.special) selectedType = 'special';
        else if (rand < weights.special + weights.rare) selectedType = 'rare';

        const pool = events.filter(e => e.rarity === selectedType);
        return pool[Math.floor(Math.random() * pool.length)] || events[0];
    }

    getSocialSuggestions(playerData) {
        const suggestions = [];

        const lowRelations = Object.entries(this.relationships)
            .filter(([id, value]) => value < 50)
            .slice(0, 3);

        if (lowRelations.length > 0) {
            suggestions.push({
                type: 'maintain_relations',
                priority: 'high',
                message: '有些同学关系比较疏远，可以多交流',
                action: 'chat',
                targets: lowRelations.map(([id]) => id)
            });
        }

        if (playerData && playerData.energy > 50) {
            suggestions.push({
                type: 'study_together',
                priority: 'medium',
                message: '精力充沛，适合和同学一起学习',
                action: 'studyTogether'
            });
        }

        if (playerData && playerData.mood < 50) {
            suggestions.push({
                type: 'improve_mood',
                priority: 'high',
                message: '心情不太好，可以找人聊聊天',
                action: 'chat'
            });
        }

        const clubs = Object.values(this.clubs);
        if (clubs.some(c => c.members.length < c.maxMembers)) {
            suggestions.push({
                type: 'join_club',
                priority: 'low',
                message: '可以考虑加入一个社团',
                action: 'browseClubs'
            });
        }

        return suggestions.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    getTeacherRelation(teacherId) {
        const value = this.relationships[`teachers:${teacherId}`] || 50;
        return {
            value,
            impression: value >= 80 ? '欣赏' : value >= 60 ? '信任' : value >= 40 ? '一般' : '陌生'
        };
    }

    getFamilyRelation(memberId) {
        const value = this.relationships[`family:${memberId}`] || 80;
        return {
            value,
            atmosphere: value >= 80 ? '和谐' : value >= 60 ? '良好' : value >= 40 ? '一般' : '紧张'
        };
    }

    getSocialStats(playerId) {
        const totalRelations = Object.values(this.relationships).reduce((a, b) => a + b, 0);
        const friends = Object.values(this.relationships).filter(v => v >= 70).length;
        const besties = Object.values(this.relationships).filter(v => v >= 90).length;
        const clubCount = Object.values(this.clubs).filter(c => c.members.includes(playerId)).length;
        const hasPosition = Object.values(this.classOfficers).some(o => o.current === playerId);

        return {
            totalFriends: friends,
            bestFriends: besties,
            clubCount,
            hasPosition,
            avgRelation: totalRelations / (Object.keys(this.relationships).length || 1),
            socialScore: friends * 10 + besties * 20 + clubCount * 15 + (hasPosition ? 30 : 0)
        };
    }
}
