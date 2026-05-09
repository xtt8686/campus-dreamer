/**
 * 教师备课系统 - 管理教师备课材料和教学质量
 * 支持PPT、PDF文件上传和AI评估
 */

export class LessonPlanSystem {
    constructor() {
        this.materials = [];
        this.currentPlan = null;
        this.qualityLevels = ['不合格', '及格', '中等', '良好', '优秀'];
    }

    addMaterial(material) {
        const newMaterial = {
            id: 'mat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...material,
            uploadedAt: Date.now(),
            status: 'pending',
            quality: null,
            qualityScore: 0,
            analysis: null
        };
        
        this.materials.push(newMaterial);
        return newMaterial;
    }

    uploadFile(file, config = {}) {
        return new Promise((resolve, reject) => {
            const validTypes = [
                'application/pdf',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            const extension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx'];

            if (!validExtensions.includes(extension)) {
                reject(new Error('不支持的文件格式'));
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                reject(new Error('文件大小不能超过10MB'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64 = e.target.result;
                const material = this.addMaterial({
                    name: file.name,
                    type: this.getFileType(extension),
                    size: file.size,
                    data: base64,
                    subject: config.subject || 'general',
                    topic: config.topic || '',
                    grade: config.grade || 7,
                    slides: config.slides || this.extractSlideCount(base64, extension)
                });
                
                this.analyzeMaterial(material).then(analyzed => {
                    resolve(analyzed);
                });
            };

            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    getFileType(extension) {
        const types = {
            'pdf': 'pdf',
            'ppt': 'ppt',
            'pptx': 'pptx',
            'doc': 'doc',
            'docx': 'docx'
        };
        return types[extension] || 'unknown';
    }

    extractSlideCount(base64, extension) {
        if (extension === 'pdf') {
            const match = base64.match(/\/Count\s+(\d+)/);
            return match ? parseInt(match[1]) : Math.floor(Math.random() * 20) + 10;
        }
        return Math.floor(Math.random() * 30) + 5;
    }

    async analyzeMaterial(material) {
        await this.simulateAnalysis();
        
        const analysis = this.performAIAnalysis(material);
        const qualityScore = this.calculateQualityScore(analysis);
        const qualityLevel = this.getQualityLevel(qualityScore);
        
        material.status = 'completed';
        material.analysis = analysis;
        material.qualityScore = qualityScore;
        material.quality = qualityLevel;
        material.analyzedAt = Date.now();

        return material;
    }

    async simulateAnalysis() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    performAIAnalysis(material) {
        const textLength = material.name.length;
        const slideCount = material.slides || 10;
        const hasTopic = material.topic && material.topic.length > 0;
        
        const structureScore = Math.min(100, (slideCount / 20) * 80 + Math.random() * 20);
        const contentScore = hasTopic ? 70 + Math.random() * 30 : 50 + Math.random() * 30;
        const formatScore = material.type === 'pptx' ? 85 + Math.random() * 15 : 70 + Math.random() * 20;
        
        const keywords = this.extractKeywords(material.topic || material.name);
        
        return {
            structure: Math.round(structureScore),
            content: Math.round(contentScore),
            format: Math.round(formatScore),
            completeness: hasTopic ? 80 + Math.random() * 20 : 50 + Math.random() * 30,
            interactivity: 30 + Math.random() * 50,
            visualDesign: 40 + Math.random() * 50,
            keywords,
            strengths: this.generateStrengths(structureScore, contentScore),
            weaknesses: this.generateWeaknesses(structureScore, contentScore),
            suggestions: this.generateSuggestions(structureScore, contentScore, interactivity)
        };
    }

    extractKeywords(text) {
        const keywords = [];
        const subjects = {
            'math': ['函数', '方程', '几何', '代数', '概率', '统计'],
            'chinese': ['阅读', '写作', '古文', '诗词', '作文', '语法'],
            'english': ['词汇', '语法', '阅读', '写作', '口语', '听力'],
            'physics': ['力学', '电磁学', '光学', '热学', '原子', '实验'],
            'chemistry': ['元素', '反应', '方程', '实验', '有机', '无机']
        };

        const subject = this.findSubject(text);
        if (subject && subjects[subject]) {
            const found = subjects[subject].filter(k => text.includes(k));
            keywords.push(...found.slice(0, 3));
        }

        const commonKeywords = ['基础', '提高', '复习', '预习', '总结', '练习'];
        commonKeywords.forEach(k => {
            if (text.includes(k)) keywords.push(k);
        });

        return [...new Set(keywords)];
    }

    findSubject(text) {
        const subjectMap = {
            '数学': 'math', '函数': 'math', '方程': 'math', '几何': 'math',
            '语文': 'chinese', '阅读': 'chinese', '写作': 'chinese', '古文': 'chinese',
            '英语': 'english', '单词': 'english', '语法': 'english',
            '物理': 'physics', '力学': 'physics', '电磁': 'physics',
            '化学': 'chemistry', '元素': 'chemistry', '反应': 'chemistry'
        };

        for (const [key, value] of Object.entries(subjectMap)) {
            if (text.includes(key)) return value;
        }
        return null;
    }

    calculateQualityScore(analysis) {
        const weights = {
            structure: 0.25,
            content: 0.25,
            format: 0.15,
            completeness: 0.15,
            interactivity: 0.1,
            visualDesign: 0.1
        };

        const score = 
            analysis.structure * weights.structure +
            analysis.content * weights.content +
            analysis.format * weights.format +
            analysis.completeness * weights.completeness +
            analysis.interactivity * weights.interactivity +
            analysis.visualDesign * weights.visualDesign;

        return Math.round(score);
    }

    getQualityLevel(score) {
        if (score >= 90) return '优秀';
        if (score >= 75) return '良好';
        if (score >= 60) return '中等';
        if (score >= 45) return '及格';
        return '不合格';
    }

    generateStrengths(structure, content) {
        const strengths = [];
        if (structure > 80) strengths.push('课件结构清晰完整');
        if (content > 80) strengths.push('教学内容充实丰富');
        if (structure > 70) strengths.push('章节安排合理');
        if (content > 70) strengths.push('知识点覆盖全面');
        if (strengths.length === 0) strengths.push('基础内容完整');
        return strengths;
    }

    generateWeaknesses(structure, content) {
        const weaknesses = [];
        if (structure < 60) weaknesses.push('课件结构有待优化');
        if (content < 60) weaknesses.push('内容深度可以加强');
        if (structure < 70) weaknesses.push('部分章节过渡不够流畅');
        if (content < 70) weaknesses.push('可增加更多实例讲解');
        return weaknesses;
    }

    generateSuggestions(structure, content, interactivity) {
        const suggestions = [];
        if (interactivity < 50) suggestions.push('建议增加互动环节');
        if (content < 70) suggestions.push('可以添加更多例题和练习');
        if (structure < 70) suggestions.push('优化PPT结构，突出重点');
        suggestions.push('适当添加动画效果增强视觉效果');
        suggestions.push('加入课堂小结环节');
        return suggestions.slice(0, 4);
    }

    createLessonPlan(config) {
        const plan = {
            id: 'plan_' + Date.now(),
            title: config.title || '新课程教案',
            subject: config.subject,
            topic: config.topic,
            grade: config.grade || 7,
            duration: config.duration || 45,
            objectives: config.objectives || [],
            materials: config.materials || [],
            activities: config.activities || [],
            homework: config.homework || '',
            quality: 0,
            createdAt: Date.now(),
            status: 'draft'
        };

        if (config.materials && config.materials.length > 0) {
            const avgScore = config.materials.reduce((sum, m) => sum + (m.qualityScore || 0), 0) / config.materials.length;
            plan.quality = Math.round(avgScore);
        }

        this.currentPlan = plan;
        return plan;
    }

    getMaterials(subject = null, status = null) {
        let result = [...this.materials];
        
        if (subject) {
            result = result.filter(m => m.subject === subject);
        }
        
        if (status) {
            result = result.filter(m => m.status === status);
        }
        
        return result.sort((a, b) => b.uploadedAt - a.uploadedAt);
    }

    getMaterial(id) {
        return this.materials.find(m => m.id === id);
    }

    deleteMaterial(id) {
        const index = this.materials.findIndex(m => m.id === id);
        if (index > -1) {
            this.materials.splice(index, 1);
            return true;
        }
        return false;
    }

    getQualityColor(score) {
        if (score >= 90) return '#10b981';
        if (score >= 75) return '#3b82f6';
        if (score >= 60) return '#f59e0b';
        if (score >= 45) return '#ef4444';
        return '#6b7280';
    }

    getQualityIcon(score) {
        if (score >= 90) return '⭐';
        if (score >= 75) return '👍';
        if (score >= 60) return '👌';
        if (score >= 45) return '⚠️';
        return '❌';
    }

    exportPlan(plan) {
        let content = '';
        
        content += `╔══════════════════════════════════════════════════╗\n`;
        content += `║              ${plan.title.padEnd(30)}║\n`;
        content += `╠══════════════════════════════════════════════════╣\n`;
        content += `║ 科目：${plan.subject.padEnd(20)}时长：${String(plan.duration + '分钟').padEnd(15)}║\n`;
        content += `║ 年级：${String(plan.grade + '年级').padEnd(20)}质量：${String(plan.quality + '分').padEnd(15)}║\n`;
        content += `╚══════════════════════════════════════════════════╝\n\n`;

        if (plan.objectives.length > 0) {
            content += `【教学目标】\n`;
            plan.objectives.forEach((obj, i) => {
                content += `${i + 1}. ${obj}\n`;
            });
            content += '\n';
        }

        if (plan.activities.length > 0) {
            content += `【教学活动】\n`;
            plan.activities.forEach((act, i) => {
                content += `${i + 1}. [${act.type}] ${act.name}\n`;
                if (act.duration) content += `   时长：${act.duration}分钟\n`;
                if (act.description) content += `   说明：${act.description}\n`;
            });
            content += '\n';
        }

        if (plan.materials.length > 0) {
            content += `【教学材料】\n`;
            plan.materials.forEach(mat => {
                content += `- ${mat.name} (${this.getQualityIcon(mat.qualityScore)} ${mat.qualityScore}分)\n`;
            });
            content += '\n';
        }

        if (plan.homework) {
            content += `【作业布置】\n${plan.homework}\n\n`;
        }

        content += `【质量评估】\n`;
        if (plan.quality >= 75) {
            content += `✅ 教案质量良好，可直接使用\n`;
        } else if (plan.quality >= 60) {
            content += `⚠️ 教案质量一般，建议完善后再使用\n`;
        } else {
            content += `❌ 建议重新准备教学材料\n`;
        }

        return content;
    }
}
