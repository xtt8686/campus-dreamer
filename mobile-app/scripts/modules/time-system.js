/**
 * 时间系统 - 游戏时间管理
 */

export class TimeSystem {
    constructor() {
        this.currentDate = {
            year: 2024,
            semester: 1,
            week: 1,
            day: 1,
            dayOfWeek: 1,
            hour: 8,
            minute: 0
        };

        this.baseSpeed = 1;
        this.realSecondsPerGameDay = 300;
        this.totalSeconds = 0;
        
        this.startDate = Date.now();
    }

    getData() {
        return {
            ...this.currentDate,
            totalSeconds: this.totalSeconds
        };
    }

    loadData(data) {
        if (data) {
            this.currentDate = {
                year: data.year || 2024,
                semester: data.semester || 1,
                week: data.week || 1,
                day: data.day || 1,
                dayOfWeek: data.dayOfWeek || 1,
                hour: data.hour || 8,
                minute: data.minute || 0
            };
            this.totalSeconds = data.totalSeconds || 0;
        }
    }

    tick(deltaTime) {
        const gameDelta = deltaTime * this.baseSpeed;
        this.totalSeconds += gameDelta;

        const msPerGameDay = this.realSecondsPerGameDay * 1000 / this.baseSpeed;
        const msPerHour = msPerGameDay / 24;

        this.currentDate.minute += (deltaTime / msPerHour) * 60;
        
        if (this.currentDate.minute >= 60) {
            this.currentDate.minute -= 60;
            this.currentDate.hour++;
        }

        if (this.currentDate.hour >= 24) {
            this.currentDate.hour = 0;
            this.advanceDay();
        }
    }

    advanceDay() {
        this.currentDate.day++;
        this.currentDate.dayOfWeek = (this.currentDate.dayOfWeek % 7) + 1;

        if (this.currentDate.day > 90) {
            this.currentDate.day = 1;
            this.currentDate.semester = this.currentDate.semester === 1 ? 2 : 1;
            
            if (this.currentDate.semester === 1) {
                this.currentDate.year++;
            }
        }

        this.currentDate.week = Math.ceil(this.currentDate.day / 7);
    }

    getCurrentDate() {
        return { ...this.currentDate };
    }

    getTermProgress() {
        return (this.currentDate.day / 90) * 100;
    }

    getTotalSeconds() {
        return this.totalSeconds;
    }

    setSpeed(speed) {
        this.baseSpeed = speed;
    }

    getSpeed() {
        return this.baseSpeed;
    }

    formatDate() {
        const { year, semester, week, day, dayOfWeek } = this.currentDate;
        const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        
        return `${year}学年 第${semester}学期 第${week}周 ${weekNames[dayOfWeek - 1]}`;
    }

    formatTime() {
        const { hour, minute } = this.currentDate;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    isWeekend() {
        return this.currentDate.dayOfWeek === 1 || this.currentDate.dayOfWeek === 7;
    }

    isHoliday() {
        return this.currentDate.day % 30 === 0;
    }

    getExamDays() {
        const examDays = [];
        
        const midtermDay = 45;
        if (this.currentDate.day <= midtermDay) {
            examDays.push({ day: midtermDay, type: 'midterm' });
        } else {
            examDays.push({ day: 90, type: 'final' });
        }

        if (this.currentDate.grade >= 9) {
            const monthExamDay = (this.currentDate.day - 1) % 30 + 1;
            if (monthExamDay === 28) {
                examDays.push({ day: this.currentDate.day, type: 'monthly' });
            }
        }

        return examDays;
    }

    shouldTriggerExam() {
        return this.currentDate.day === 45 || this.currentDate.day === 90;
    }

    shouldTriggerWeeklyExam() {
        return this.currentDate.dayOfWeek === 5;
    }

    shouldTriggerMonthlyExam() {
        return this.currentDate.day % 30 === 28;
    }

    addDays(days) {
        for (let i = 0; i < days; i++) {
            this.advanceDay();
        }
    }

    getTimeUntilExam() {
        const targetDays = [45, 90];
        let nearest = null;
        
        for (const day of targetDays) {
            if (day > this.currentDate.day) {
                nearest = day - this.currentDate.day;
                break;
            }
        }

        return nearest || (90 - this.currentDate.day);
    }
}
