import { User, CreateUser, UserRepository } from "../types.ts";
import { Database, Collection } from '../../deps.ts' 

interface RepositoryDependencies {
    storage: Database,
}

export class Repository implements UserRepository {
    storage: Collection<User>
    constructor({ storage }: RepositoryDependencies) {
        this.storage = storage.collection<User>('users');
    }

    //create operation (creating a user in the database)
    // deno-lint-ignore require-await
    async create (user: CreateUser ) {
        const userWithCreatedAt = { ...user, createdAt:new Date()}
        this.storage.insertOne({ ...userWithCreatedAt })
        return userWithCreatedAt;
    }

    async exists ( username: string ) {
        return Boolean(await this.storage.findOne({ username }))
    }
    // async exists(username: string) {
    //     return Boolean(this.storage.get(username));
    //   }
    
//read operation (reading the value of user from the database by username)
    async getByUsername (username: string) {
        const user = await this.storage.findOne( { username } );
        if(!user) {
            throw new Error ("User not found ")
        } 
        return user;
    }
//delete operation on 
    async deleteUser(username: string) {
        const deletedUser = await this.storage.deleteOne({ username })
        return deletedUser;
    }
    

}