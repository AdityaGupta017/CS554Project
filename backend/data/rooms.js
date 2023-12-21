import { rooms } from '../config/mongoCollection.js';
// import userData from './users.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';


const exportedMethods = {
  async getAllRooms() {
    const roomCollection = await rooms();
    return await roomCollection.find({}).toArray();
  },

  async getAllPublicRooms() {
    console.log("public rooms data route")
    const roomCollection = await rooms();
    const roomsData = await roomCollection.find({}).toArray();
    let publicRooms=[]
    for(let i=0;i<roomsData.length;i++){
      if(!roomsData[i].isPrivate){
        publicRooms.push(roomsData[i])
      }
    }
    console.log("public rooms", publicRooms)
    return publicRooms;
  },

  async getRoomById(id) {
    // id = validation.checkId(id);
    const roomCollection = await rooms();
    const room = await roomCollection.findOne({_id: new ObjectId(id)});
    if (!room) throw 'Error: Room not found';

    return room;
  },
//   async getPostsByTag(tag) {
//     tag = validation.checkString(tag, 'Tag');
//     const postCollection = await posts();
//     return await postCollection.find({tags: tag}).toArray();
//   },
  async addRoom(title, adminID, isPrivate) {
    console.log('insideeee room yo')
    title = validation.checkString(title, 'Title');
    console.log("private status",isPrivate)
    // adminID = validation.checkId(adminID, 'Admin ID');

    // userThatCreatedRoom = 'Get current logged in user id'
    // //const userThatCreatedRoom = await userData.getUserById(adminID);
    // if (!userThatCreatedRoom) throw 'User for room not found';

    const newRoom = {
      title: title,
      isPrivate: isPrivate,
      adminID: adminID,
      memberIDs: []
    };

    console.log(newRoom)
    const roomCollection = await rooms();
    const newInsertInformation = await roomCollection.insertOne(newRoom);
    const newId = newInsertInformation.insertedId;
    return await this.getRoomById(newId.toString());
  },
  async removeRoom(id) {
    // id = validation.checkId(id);
    const roomCollection = await rooms();
    const deletionInfo = await roomCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
    if (!deletionInfo) throw `Could not delete room with id of ${id}`;
    return {...deletionInfo, deleted: true};
  },
//   async updatePostPut(id, updatedPost) {
//     id = validation.checkId(id);
//     updatedPost.title = validation.checkString(updatedPost.title, 'title');
//     updatedPost.body = validation.checkString(updatedPost.body, 'body');
//     updatedPost.posterId = validation.checkId(updatedPost.posterId);
//     if (!Array.isArray(updatedPost.tags)) {
//       updatedPost.tags = [];
//     } else {
//       updatedPost.tags = validation.checkStringArray(updatedPost.tags, 'Tags');
//     }
//     const userThatPosted = await userData.getUserById(updatedPost.posterId);
//     if (!userThatPosted) throw 'User for post not found';
//     let updatedPostData = {
//       title: updatedPost.title,
//       body: updatedPost.body,
//       poster: {
//         id: updatedPost.posterId,
//         firstName: userThatPosted.firstName,
//         lastName: userThatPosted.lastName
//       },
//       tags: updatedPost.tags
//     };
//     const postCollection = await posts();
//     const updateInfo = await postCollection.findOneAndReplace(
//       {_id: new ObjectId(id)},
//       updatedPostData,
//       {returnDocument: 'after'}
//     );
//     if (!updateInfo)
//       throw `Error: Update failed! Could not update post with id ${id}`;
//     return updateInfo;
//   },
//   async updateRoomPatch(id, updatedRoom) {
//     const updatedRoomData = {};
//     if (updatedRoom.adminID) {
//         updatedRoomData['poster.id'] = validation.checkId(
//         updatedPost.posterId,
//         'Poster ID'
//       );

//       const userThatPosted = await userData.getUserById(updatedPost.posterId);
//       if (!userThatPosted) throw 'User for post not found';
//       updatedPostData['poster.firstName'] = userThatPosted.firstName;
//       updatedPostData['poster.lastName'] = userThatPosted.lastName;
//     }
//     if (updatedPost.tags) {
//       updatedPostData.tags = validation.checkStringArray(
//         updatedPost.tags,
//         'Tags'
//       );
//     }

//     if (updatedPost.title) {
//       updatedPostData.title = validation.checkString(
//         updatedPost.title,
//         'Title'
//       );
//     }

//     if (updatedPost.body) {
//       updatedPostData.body = validation.checkString(updatedPost.body, 'Body');
//     }
//     const postCollection = await posts();
//     let newPost = await postCollection.findOneAndUpdate(
//       {_id: new ObjectId(id)},
//       {$set: updatedPostData},
//       {returnDocument: 'after'}
//     );
//     if (!newPost) throw `Could not update the post with id ${id}`;

//     return newPost;
//   },
//   async renameTag(oldTag, newTag) {
//     oldTag = validation.checkString(oldTag, 'Old Tag');
//     newTag = validation.checkString(newTag, 'New Tag');
//     if (oldTag === newTag) throw 'tags are the same';

//     let findDocuments = {
//       tags: oldTag
//     };

//     let firstUpdate = {
//       $addToSet: {tags: newTag}
//     };

//     let secondUpdate = {
//       $pull: {tags: oldTag}
//     };
//     const postCollection = await posts();
//     let updateOne = await postCollection.updateMany(findDocuments, firstUpdate);
//     if (updateOne.matchedCount === 0)
//       throw `Could not find any posts with old tag: ${oldTag}`;
//     let updateTwo = await postCollection.updateMany(
//       findDocuments,
//       secondUpdate
//     );
//     if (updateTwo.modifiedCount === 0) throw [500, 'Could not update tags'];
//     return await this.getPostsByTag(newTag);
//   }
};

export default exportedMethods;