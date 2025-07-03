class UserService{

    constructor(UserRepository){
        this.userRepository = UserRepository;
    }
    
    async login(userData){
            const user = await this.userRepository.login(userData);
            return user;
    }

    async createUser(userData){
        // validation
        const user = await this.userRepository.createUser(userData);
        return user;
    }



}

module.exports = UserService;