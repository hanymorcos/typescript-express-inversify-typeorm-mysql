import { injectable, inject} from 'inversify';
import { User } from '../entity/t_user'
import { getEntityManager } from 'typeorm';
import TYPES from '../constant/types'

export interface IUser {
  email: string;
  name: string;
}

@injectable()
export class UserService {
  


  public getUsers(): Promise<IUser[]> {
   let usersPr =  getEntityManager().getRepository(User).find();
    usersPr.then((users) => {
         var userList : IUser[] = [];
         for (let user of users)
          {
            userList.push({email:user.email, name: user.name});
          }
          return userList;
    });

    return usersPr; 
  }

  public getUser(id: string): Promise<IUser> {
   
     let user =  getEntityManager().getRepository(User).findOne({email:id});
     user.then((u)=> {  return  {email: u.email, name: u.name}});

   return user; 
  }

  public newUser(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
       let uentity: User = new User();
       uentity.email  = user.email;
       uentity.name = user.name;
       let e =  getEntityManager().getRepository(User).persist(uentity);
       
       resolve(user);
  });
  }

  public updateUser(id: string, user: IUser): Promise<IUser> {
   let userRepository = getEntityManager().getRepository(User);
   let userT = userRepository.findOne({email:id});
    userT.then((u) => {
       u.name = user.name;
       userRepository.persist(u);
    });


    return userT;
  }

  public deleteUser(id: string) : Promise<IUser>{
   
  let userRepository = getEntityManager().getRepository(User);
   let userT = userRepository.findOne({email:id});
    userT.then((u) => {
       userRepository.remove(u);
    });


    return userT;

  }
}
