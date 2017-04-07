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
   let returnType = usersPr.then((users) => {
         var userList : IUser[] = [];
         for (let user of users)
          {
            userList.push({email:user.email, name: user.name});
          }
          return userList;
    }).catch(console.log.bind(console));

    return returnType; 
  }

  public getUser(id: string): Promise<IUser> {
   
     let user =  getEntityManager().getRepository(User).findOne({email:id});
     let returnType = user.then((u)=> {  return  {email: u.email, name: u.name}});

   return returnType; 
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

  public updateUser(id: string, name: string): Promise<IUser> {
   var userRepository = getEntityManager().getRepository(User);
   var userT = userRepository.findOne({email:id});
   var returnType = userT.then((u) => {
      
       let uentity: User = new User();
       uentity.email  = id;
       uentity.name = name;
       userRepository.persist(uentity);
       return {email:id,name:name};
    });
    
    return returnType;
  }

  public deleteUser(id: string) {
  var userRepository = getEntityManager().getRepository(User);
   var userT = userRepository.findOne({email:id});
    userT.then((u) => {
       userRepository.remove(u);
    });



  }
}
