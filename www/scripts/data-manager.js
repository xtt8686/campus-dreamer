/**
 * 数据管理器 - 游戏数据持久化
 */

export class DataManager {
    constructor() {
        this.storageKey = 'campus_dreamer_save';
        this.maxSaves = 3;
    }

    save(data) {
        try {
            const saveData = {
                ...data,
                meta: {
                    ...data.meta,
                    lastSave: Date.now()
                }
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('💾 数据已保存');
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                console.log('📂 数据已加载');
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('加载失败:', error);
            return null;
        }
    }

    loadWithValidation() {
        const data = this.load();
        
        if (!data) return null;

        if (!this.validateData(data)) {
            console.warn('⚠️ 数据格式不完整，将使用默认值');
            return this.getDefaultData();
        }

        return data;
    }

    validateData(data) {
        const required = ['meta', 'player', 'time'];
        
        for (const key of required) {
            if (!data[key]) {
                console.warn(`缺失: ${key}`);
                return false;
            }
        }

        return true;
    }

    getDefaultData() {
        return {
            meta: {
                version: '1.0',
                lastSave: Date.now(),
                playTime: 0
            },
            player: null,
            time: {
                year: 2024,
                semester: 1,
                week: 1,
                day: 1,
                dayOfWeek: 1
            }
        };
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ 数据已清除');
            return true;
        } catch (error) {
            console.error('清除失败:', error);
            return false;
        }
    }

    exportData() {
        const data = this.load();
        if (!data) return null;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `campus_dreamer_backup_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('📤 数据已导出');
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.validateData(data)) {
                        this.save(data);
                        resolve(data);
                    } else {
                        reject(new Error('数据格式无效'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    getStorageInfo() {
        const data = localStorage.getItem(this.storageKey);
        
        return {
            exists: !!data,
            size: data ? new Blob([data]).size : 0,
            lastSave: data ? JSON.parse(data).meta.lastSave : null
        };
    }
}
