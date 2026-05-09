/**
 * 家长会系统 - 管理家长会和家校沟通
 */

export class ParentConferenceSystem {
    constructor() {
        this.conferences = [];
        this.feedback = [];
        this.appointments = [];
    }

    createConference(config) {
        const conference = {
            id: 'conf_' + Date.now(),
            title: config.title || '期中家长会',
            date: config.date || Date.now(),
            duration: config.duration || 120,
            location: config.location || '教室',
            host: config.host || '班主任',
            type: config.type || 'regular',
            grade: config.grade || 7,
            className: config.className || '1班',
            attendees: [],
            agenda: config.agenda || this.getDefaultAgenda(config.type),
            reports: [],
            status: 'scheduled',
            createdAt: Date.now()
        };

        this.conferences.push(conference);
        return conference;
    }

    getDefaultAgenda(type) {
        if (type === 'emergency') {
            return [
                { time: 0, title: '紧急事项说明', duration: 30, speaker: '班主任' },
                { time: 30, title: '问题讨论', duration: 30, speaker: '全体' }
            ];
        }

        return [
            { time: 0, title: '开场致辞', duration: 5, speaker: '班主任' },
            { time: 5, title: '学期情况汇报', duration: 25, speaker: '班主任' },
            { time: 30, title: '学习成绩分析', duration: 20, speaker: '各科教师代表' },
            { time: 50, title: '学生表现评价', duration: 15, speaker: '班主任' },
            { time: 65, title: '表彰优秀学生', duration: 10, speaker: '班主任' },
            { time: 75, title: '家长代表发言', duration: 10, speaker: '家长代表' },
            { time: 85, title: '问题答疑环节', duration: 25, speaker: '全体' },
            { time: 110, title: '个别交流时间', duration: 10, speaker: '班主任' }
        ];
    }

    scheduleConference(config) {
        const conference = this.createConference(config);
        this.generateAppointments(conference);
        return conference;
    }

    generateAppointments(conference) {
        const teachers = [
            { name: '语文王老师', subject: 'chinese' },
            { name: '数学李老师', subject: 'math' },
            { name: '英语张老师', subject: 'english' }
        ];

        teachers.forEach(teacher => {
            const appointment = {
                id: 'apt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                conferenceId: conference.id,
                teacher,
                timeSlot: `${10 + Math.floor(Math.random() * 50)}分钟`,
                available: true,
                bookedBy: null
            };
            this.appointments.push(appointment);
        });
    }

    bookAppointment(appointmentId, parentId) {
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (appointment && appointment.available) {
            appointment.available = false;
            appointment.bookedBy = parentId;
            appointment.bookedAt = Date.now();
            return true;
        }
        return false;
    }

    addReport(conferenceId, report) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (conference) {
            const newReport = {
                id: 'rep_' + Date.now(),
                ...report,
                createdAt: Date.now()
            };
            conference.reports.push(newReport);
            return newReport;
        }
        return null;
    }

    addAttendee(conferenceId, attendee) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (conference) {
            const newAttendee = {
                id: 'att_' + Date.now(),
                ...attendee,
                registeredAt: Date.now(),
                feedback: null,
                present: false
            };
            conference.attendees.push(newAttendee);
            return newAttendee;
        }
        return null;
    }

    startConference(conferenceId) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (conference && conference.status === 'scheduled') {
            conference.status = 'in_progress';
            conference.startedAt = Date.now();
            return conference;
        }
        return null;
    }

    endConference(conferenceId) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (conference && conference.status === 'in_progress') {
            conference.status = 'completed';
            conference.endedAt = Date.now();
            return conference;
        }
        return null;
    }

    addFeedback(conferenceId, feedbackData) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (conference) {
            const feedback = {
                id: 'fb_' + Date.now(),
                conferenceId,
                ...feedbackData,
                submittedAt: Date.now()
            };
            this.feedback.push(feedback);

            const attendee = conference.attendees.find(a => a.id === feedbackData.attendeeId);
            if (attendee) {
                attendee.feedback = feedback;
            }

            return feedback;
        }
        return null;
    }

    getConference(id) {
        return this.conferences.find(c => c.id === id);
    }

    getUpcomingConferences() {
        const now = Date.now();
        return this.conferences
            .filter(c => c.status === 'scheduled' && c.date > now)
            .sort((a, b) => a.date - b.date);
    }

    getPastConferences() {
        return this.conferences
            .filter(c => c.status === 'completed')
            .sort((a, b) => b.date - a.date);
    }

    getTeacherPerformance(teacherId) {
        const teacherFeedback = this.feedback.filter(f => f.teacherId === teacherId);
        
        if (teacherFeedback.length === 0) {
            return { rating: 0, count: 0, comments: [] };
        }

        const avgRating = teacherFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / teacherFeedback.length;
        
        return {
            rating: Math.round(avgRating * 10) / 10,
            count: teacherFeedback.length,
            satisfaction: this.getSatisfactionLevel(avgRating),
            comments: teacherFeedback.map(f => f.comment).filter(Boolean)
        };
    }

    getSatisfactionLevel(rating) {
        if (rating >= 4.5) return '非常满意';
        if (rating >= 4.0) return '满意';
        if (rating >= 3.0) return '一般';
        if (rating >= 2.0) return '不太满意';
        return '不满意';
    }

    generateReport(conferenceId) {
        const conference = this.conferences.find(c => c.id === conferenceId);
        if (!conference) return null;

        const presentCount = conference.attendees.filter(a => a.present).length;
        const feedbackData = this.feedback.filter(f => f.conferenceId === conferenceId);
        const avgSatisfaction = feedbackData.length > 0
            ? feedbackData.reduce((sum, f) => sum + (f.overallRating || 0), 0) / feedbackData.length
            : 0;

        let report = '';
        report += `╔══════════════════════════════════════════════════╗\n`;
        report += `║        📋 家长会报告单                          ║\n`;
        report += `╠══════════════════════════════════════════════════╣\n`;
        report += `║ ${conference.title.padEnd(40)}║\n`;
        report += `║ 日期：${new Date(conference.date).toLocaleDateString('zh-CN').padEnd(30)}║\n`;
        report += `║ 年级：${String(conference.grade + '年级').padEnd(32)}║\n`;
        report += `║ 班级：${conference.className.padEnd(33)}║\n`;
        report += `╠══════════════════════════════════════════════════╣\n`;
        report += `║ 出席情况                                        ║\n`;
        report += `║ 应到人数：${String(conference.attendees.length).padEnd(10)}实到：${String(presentCount).padEnd(16)}║\n`;
        report += `║ 出勤率：${String(Math.round(presentCount / (conference.attendees.length || 1) * 100) + '%').padEnd(10)}满意率：${String(this.getSatisfactionLevel(avgSatisfaction)).padEnd(14)}║\n`;
        report += `╠══════════════════════════════════════════════════╣\n`;
        report += `║ 议程安排                                        ║\n`;
        
        conference.agenda.forEach(item => {
            const timeStr = `${item.time}-${item.time + item.duration}分钟`;
            report += `║ ${timeStr.padEnd(10)} ${item.title.padEnd(20)} ${item.speaker.padEnd(8)}║\n`;
        });

        report += `╠══════════════════════════════════════════════════╣\n`;
        report += `║ 反馈摘要                                        ║\n`;
        
        if (feedbackData.length > 0) {
            const positiveFeedback = feedbackData.filter(f => f.overallRating >= 4).length;
            const suggestions = feedbackData.filter(f => f.suggestions).length;
            
            report += `║ 收到反馈：${String(feedbackData.length).padEnd(10)}条  好评率：${String(Math.round(positiveFeedback / feedbackData.length * 100) + '%').padEnd(12)}║\n`;
            report += `║ 提出建议：${String(suggestions).padEnd(10)}条                           ║\n`;
        } else {
            report += `║ 暂无反馈数据                                     ║\n`;
        }

        report += `╚══════════════════════════════════════════════════╝\n`;

        return report;
    }

    getStudentProgress(studentId) {
        const reports = this.conferences
            .filter(c => c.reports.some(r => r.studentId === studentId))
            .flatMap(c => c.reports.filter(r => r.studentId === studentId));

        if (reports.length === 0) return null;

        return {
            studentId,
            totalReports: reports.length,
            avgScore: reports.reduce((sum, r) => sum + (r.score || 0), 0) / reports.length,
            latestReport: reports[reports.length - 1],
            trends: this.analyzeTrends(reports)
        };
    }

    analyzeTrends(reports) {
        const sorted = reports.sort((a, b) => a.createdAt - b.createdAt);
        
        if (sorted.length < 2) return { direction: 'stable', change: 0 };

        const first = sorted[0].score || 0;
        const last = sorted[sorted.length - 1].score || 0;
        const change = last - first;

        return {
            direction: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
            change: Math.round(change * 10) / 10
        };
    }
}
