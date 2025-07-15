import { User, CreateUserDto, UpdateUserDto } from '@/types';
export declare class UserModel {
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: string): Promise<User | null>;
    static create(userData: CreateUserDto): Promise<User>;
    static update(id: string, userData: UpdateUserDto): Promise<User | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(limit?: number, offset?: number): Promise<User[]>;
    static count(): Promise<number>;
}
//# sourceMappingURL=User.d.ts.map