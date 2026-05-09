/**
 * 事件系统 - 管理游戏事件和触发器
 */

export class EventSystem {
    constructor() {
        this.events = [];
        this.handlers = {};
        this.eventHistory = [];
        this.upcomingEvents = [];
    }

    addEvent(event) {
        const newEvent = {
            id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...event,
            createdAt: Date.now(),
            triggered: false
        };

        this.events.push(newEvent);
        this.sortEvents();

        return newEvent;
    }

    removeEvent(eventId) {
        const index = this.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
            return true;
        }
        return false;
    }

    triggerEvent(eventType, data = {}) {
        const event = {
            id: 'event_' + Date.now(),
            type: eventType,
            data,
            triggeredAt: Date.now()
        };

        this.eventHistory.push(event);

        if (this.handlers[eventType]) {
            this.handlers[eventType].forEach(handler => {
                try {
                    handler(event, data);
                } catch (error) {
                    console.error(`事件处理器错误 [${eventType}]:`, error);
                }
            });
        }

        return event;
    }

    registerHandler(eventType, handler) {
        if (!this.handlers[eventType]) {
            this.handlers[eventType] = [];
        }

        this.handlers[eventType].push(handler);

        return () => {
            this.unregisterHandler(eventType, handler);
        };
    }

    unregisterHandler(eventType, handler) {
        if (this.handlers[eventType]) {
            const index = this.handlers[eventType].indexOf(handler);
            if (index !== -1) {
                this.handlers[eventType].splice(index, 1);
            }
        }
    }

    update(deltaTime) {
        this.processTimeEvents(deltaTime);
        this.processScheduledEvents();
        this.generateRandomEvents(deltaTime);
    }

    processTimeEvents(deltaTime) {
        const currentTime = Date.now();

        this.events = this.events.filter(event => {
            if (event.triggered) return false;

            if (event.type === 'scheduled' && event.scheduledTime <= currentTime) {
                this.triggerEvent(event.eventType, event.data);
                event.triggered = true;
                return false;
            }

            if (event.type === 'periodic') {
                const elapsed = currentTime - event.lastTriggered;
                if (elapsed >= event.interval) {
                    this.triggerEvent(event.eventType, event.data);
                    event.lastTriggered = currentTime;
                }
            }

            if (event.type === 'conditional') {
                if (this.checkCondition(event.condition)) {
                    this.triggerEvent(event.eventType, event.data);
                    event.triggered = true;
                    return false;
                }
            }

            return true;
        });
    }

    processScheduledEvents() {
        const now = Date.now();

        this.upcomingEvents = this.events
            .filter(e => !e.triggered && e.scheduledTime)
            .sort((a, b) => a.scheduledTime - b.scheduledTime);
    }

    generateRandomEvents(deltaTime) {
        const probability = deltaTime / (60 * 1000);

        if (Math.random() < probability * 0.1) {
            const randomEvent = this.generateRandomEvent();
            this.triggerEvent(randomEvent.type, randomEvent.data);
        }
    }

    generateRandomEvent() {
        const eventTemplates = [
            {
                type: 'academic_competition',
                data: {
                    name: '数学竞赛',
                    subject: 'math',
                    description: '学校举办数学竞赛，你可以参加'
                }
            },
            {
                type: 'sports_meeting',
                data: {
                    name: '运动会',
                    description: '学校运动会即将开始'
                }
            },
            {
                type: 'art_festival',
                data: {
                    name: '艺术节',
                    description: '一年一度的艺术节到了'
                }
            },
            {
                type: 'parent_meeting',
                data: {
                    name: '家长会',
                    description: '班主任通知召开家长会'
                }
            },
            {
                type: 'teacher_praise',
                data: {
                    name: '老师表扬',
                    teacher: '王老师',
                    description: '王老师在课堂上表扬了你'
                }
            },
            {
                type: 'friend_conflict',
                data: {
                    name: '同学矛盾',
                    description: '和同学发生了小矛盾'
                }
            },
            {
                type: 'equipment_issue',
                data: {
                    name: '设备故障',
                    location: '教室',
                    description: '教室设备出现故障'
                }
            },
            {
                type: 'study_breakthrough',
                data: {
                    name: '学习突破',
                    subject: 'math',
                    description: '突然对某个知识点有了深入理解'
                }
            }
        ];

        return eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    }

    checkCondition(condition) {
        if (typeof condition === 'function') {
            return condition();
        }

        if (condition.type === 'time_range') {
            const now = Date.now();
            return now >= condition.start && now <= condition.end;
        }

        if (condition.type === 'attribute') {
            const value = condition.value;
            const threshold = condition.threshold;
            const operator = condition.operator || '>=';

            switch (operator) {
                case '>': return value > threshold;
                case '<': return value < threshold;
                case '>=': return value >= threshold;
                case '<=': return value <= threshold;
                case '==': return value === threshold;
                default: return value >= threshold;
            }
        }

        return false;
    }

    scheduleEvent(eventType, data, scheduledTime) {
        return this.addEvent({
            type: 'scheduled',
            eventType,
            data,
            scheduledTime
        });
    }

    createPeriodicEvent(eventType, data, interval) {
        return this.addEvent({
            type: 'periodic',
            eventType,
            data,
            interval,
            lastTriggered: Date.now()
        });
    }

    createConditionalEvent(eventType, data, condition) {
        return this.addEvent({
            type: 'conditional',
            eventType,
            data,
            condition
        });
    }

    sortEvents() {
        this.events.sort((a, b) => {
            if (a.priority && b.priority) {
                return b.priority - a.priority;
            }
            return 0;
        });
    }

    getUpcomingEvents() {
        return this.upcomingEvents;
    }

    getEventHistory() {
        return this.eventHistory;
    }

    clearHistory() {
        this.eventHistory = [];
    }

    getActiveEvents() {
        return this.events.filter(e => !e.triggered);
    }

    hasEvent(eventType) {
        return this.events.some(e => e.eventType === eventType && !e.triggered);
    }

    getEventById(eventId) {
        return this.events.find(e => e.id === eventId);
    }
}
