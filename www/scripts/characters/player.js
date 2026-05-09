/**
 * 角色工厂 - 创建游戏角色
 */

import { Student } from './student.js';
import { Teacher } from './teacher.js';
import { Principal } from './principal.js';

export class PlayerFactory {
    static create(data) {
        switch(data.type) {
            case 'student':
                return new Student(data);
            case 'teacher':
                return new Teacher(data);
            case 'principal':
                return new Principal(data);
            default:
                throw new Error(`Unknown player type: ${data.type}`);
        }
    }
}
