import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

// ============================== Create User Account ==============================

export async function createUserAccount(user:INewUser){
   try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.username
      )
      if(!newAccount) throw Error;
 
      const avatarUrl = avatars.getInitials(user.name);

      const newUser = await saveUserToDB({
         accountId : newAccount.$id,
         email : newAccount.email,
         name : newAccount.name,
         username : user.username,
         imageUrl : avatarUrl
      })

      return newUser
   } catch (error) {
    console.log(error)
    return error
   }
}
// ============================== Save User To DataBase ==============================

export async function saveUserToDB(user:{
   accountId : string;
   username? : string;
   email : string;
   name : string;
   imageUrl : URL;
}){
   try {
         const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
         )
         return newUser
   } catch (error) {
      console.log(error)
   }
}

// ============================== Create session ==============================
export async function signInAccount (user: {
   email: string;
   password: string
}){
   try {
      const session = await account.createEmailSession(user.email,user.password)
      return session;
   } catch (error) {
      console.log(error)
   }
}
// ============================== GET ACCOUNT ==============================
export async function getAccount() {
   try {
     const currentAccount = await account.get();
 
     return currentAccount;
   } catch (error) {
     console.log(error);
   }
 }

// ============================== GET USER ==============================
export async function getCurrentUser(){
   try {
      const currentAccount = await getAccount()
     
      if(!currentAccount) throw Error;

      // console.log([Query.equal("accountId", currentAccount.$id)])
      const currentUser = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal( "accountId", currentAccount.$id )]
      )
      if(!currentUser) throw Error;
      return currentUser.documents[0]
       
   } catch (error) {
      console.log(error)
      // return null
   }
}
// ============================== Sign Out ==============================
export async function signOutAccount(){
   try {
      const session = await account.deleteSession('current')
      return session
   } catch (error) {
      console.log(error)
   }
}
// ============================== Create Post ==============================
export async function createPost(post: INewPost){
   try {
      //Upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);

      if(!uploadedFile) throw Error;

      //Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if(!fileUrl) {
         await deleteFile(uploadedFile.$id)
         throw Error;
      }
     // Convert tags in an array
     const tags = post.tags?.replace(/ /g,'').split(',') || [];

     // Save post to database
       const newPost = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          ID.unique(),
          {
               creator: post.userId,
               caption: post.caption,
               imageUrl: fileUrl,
               // imageUrl: `https://cloud.appwrite.io/v1/storage/buckets/${ appwriteConfig.storageId }/files/${uploadedFile.$id}`,
               // imageUrl: 'https://cloud.appwrite.io/v1/storage/buckets/65f99a88172512692466/files/66081daab4121dc757b9',
               imageId: uploadedFile.$id,
               location: post.location,
               tags: tags,
          }
       );
       if(!newPost) {
         await deleteFile(uploadedFile.$id);
         throw Error;
       }
         return newPost;

   } catch (error) {
      console.log(error)
   }
}
// ============================== Upload File ==============================
export async function uploadFile(file: File){
   try {
      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file,
      );
      // console.log(uploadedFile)
      return uploadedFile;
   }catch(error) {
      console.log(error)
   }
}
// ============================== Get File Preview =========================
export function getFilePreview(fileId: string){
   try {
      const fileUrl = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         2000,
         2000,
         'top',
         100
      );

      if (!fileUrl) throw Error;
      // console.log(fileUrl)
      return fileUrl
   } catch (error) {
      console.log(error)
   }
}
// ============================== Delete File ==============================
export async function deleteFile(fileId: string){
   try {
         await storage.deleteFile(
         appwriteConfig.storageId,
         fileId
      )
      return {status : 'oK'}
   } catch (error) {
      console.log(error)
   }
}
// ============================== Get Recent Posts ==============================
export async function getRecentPosts() {
   try {
     const posts = await databases.listDocuments(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       [Query.orderDesc("$createdAt"), Query.limit(20)]
     );
 
     if (!posts) throw Error;
 
     return posts;
   } catch (error) {
     console.log(error);
   }
 }
// ============================== Like Post ==============================

export async function likePost (postId: string, likesArray: string[]){
   try {
      const updatePost = await databases.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
         {
            like: likesArray
         }
      )
      if(!updatePost) throw Error;

      return updatePost
   } catch (error) {
      console.log(error)
   }
}
// ============================== Save Post ==============================
export async function savePost (postId: string, userId: string){
   try {
      const updatePost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         ID.unique(),
         {
           user: userId,
           post: postId,
         }
      )
      if(!updatePost) throw Error;

      return updatePost
   } catch (error) {
      console.log(error)
   }
}
// ============================== Delete Post ==============================
export async function deleteSavedPost (savedRecordId: string){
   try {
      const statusCode = await databases.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         savedRecordId
      )
      if(!statusCode) throw Error;

      return {status: 'ok'}
   } catch (error) {
      console.log(error)
   }
}
// ============================== Get Posts By Id ==============================
export async function getPostById( postId : string) {
   try {
      const post = await databases.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
      )
      return post
   } catch (error) {
      console.log(error)
   }
}
// ============================== Update Post ==============================
export async function updatePost(post: IUpdatePost){
   const hasFileToUpdate = post.file.length > 0;
   try {
      let image = {
         imageUrl: post.imageUrl,
         imageId: post.imageId
      }
 
      if (hasFileToUpdate) {
         //Upload image to storage
         const uploadedFile = await uploadFile(post.file[0]);
         if(!uploadedFile) throw Error;
   
         //Get file url
         const fileUrl = getFilePreview(uploadedFile.$id);
         if(!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error;
         }
         image = { ...image, imageUrl: fileUrl , imageId: uploadedFile.$id }
      }

     // Convert tags in an array
     const tags = post.tags?.replace(/ /g,'').split(',') || [];

     // Save post to database
       const updatePost = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          post.postId,
          {
               caption: post.caption,
               imageUrl: image.imageUrl,
               imageId: image.imageId,
               location: post.location,
               tags: tags,
          }
       );
       if(!updatePost) {
         await deleteFile(post.imageId);
         throw Error;
       }
         return updatePost;

   } catch (error) {
      console.log(error)
   }
}
// ============================== Delete Post ==============================
export async function deletePost(postId: string, imageId: string){
   if( !postId || !imageId ) throw Error;
   try {
         await databases.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      )
      
      return {status: 'ok'}
   } catch (error) {
      console.log(error)
   }
}
// ============================== Get Infinite Posts==============================
export async function getInfinitePosts({pageParam = 0}: {pageParam: number}){
   const queries: any[] = [Query.orderDesc('$updatedAt'),Query.limit(9)]

   if(pageParam){
      queries.push(Query.cursorAfter(pageParam.toString()));
   }
   try {
      const posts = await databases.listDocuments( 
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         queries
      )
      if(!posts) throw Error;

      return {...posts, prevOffset: pageParam}
   } catch (error) {
      console.log(error)
   }
}
// ==============================Search Posts ==============================
export async function searchPosts(searchTerm: string){
   try {
      const posts = await databases.listDocuments( 
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [Query.search('caption', searchTerm)]
      )
      if(!posts) throw Error;

      return posts
   } catch (error) {
      console.log(error)
   }
}
// ============================== GET USER BY ID ==============================
export async function getUserById(userId: string) {
   try {
     const user = await databases.getDocument(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       userId
     );
 
     if (!user) throw Error;
 
     return user;
   } catch (error) {
     console.log(error);
   }
 }
// ============================== GET USERS ==============================
export async function getUsers(limit?: number) {
   const queries: any[] = [Query.orderDesc("$createdAt")];
 
   if (limit) {
     queries.push(Query.limit(limit));
   }
 
   try {
     const users = await databases.listDocuments(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       queries
     );
 
     if (!users) throw Error;
 
     return users;
   } catch (error) {
     console.log(error);
   }
 }
// ============================== UPDATE USER ==============================
export async function updateUser(user: IUpdateUser) {
   const hasFileToUpdate = user.file.length > 0;
   try {
     let image = {
       imageUrl: user.imageUrl,
       imageId: user.imageId,
     };
 
     if (hasFileToUpdate) {
       // Upload new file to appwrite storage
       const uploadedFile = await uploadFile(user.file[0]);
       if (!uploadedFile) throw Error;
 
       // Get new file url
       const fileUrl = getFilePreview(uploadedFile.$id);
       if (!fileUrl) {
         await deleteFile(uploadedFile.$id);
         throw Error;
       }
 
       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
     }
 
     //  Update user
     const updatedUser = await databases.updateDocument(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       user.userId,
       {
         name: user.name,
         bio: user.bio,
         imageUrl: image.imageUrl,
         imageId: image.imageId,
       }
     );
 
     // Failed to update
     if (!updatedUser) {
       // Delete new file that has been recently uploaded
       if (hasFileToUpdate) {
         await deleteFile(image.imageId);
       }
       // If no new file uploaded, just throw error
       throw Error;
     }
 
     // Safely delete old file after successful update
     if (user.imageId && hasFileToUpdate) {
       await deleteFile(user.imageId);
     }
 
     return updatedUser;
   } catch (error) {
     console.log(error);
   }
 }
// ============================== Filter Posts  ==============================
export async function filterPosts(filter: string){
   try {
      const posts = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [Query.search('tags', filter)]
      )
      if(!posts) throw Error;

      return posts
   } catch (error) {
      console.log(error)
   }
}
//================================Search Uers==============================
export async function getSearchUsers(searchTerm: string){
   try {
      const users = await databases.listDocuments( 
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.search('name', searchTerm)]
      )
      if(!users) throw Error;
      return users
   } catch (error) {
      console.log('hello',error)
   }
}
//================================Get User Posts===========================
export async function getUserPosts(userId?: string) {
   if (!userId) return;
 
   try {
     const post = await databases.listDocuments(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
     );
 
     if (!post) throw Error;
 
     return post;
   } catch (error) {
     console.log(error);
   }
 }