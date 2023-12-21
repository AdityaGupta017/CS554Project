import {Router} from 'express';
const router = Router();
import { roomData } from '../../data/index.js';
import validation from '../../validation.js';

router
  .route('/')
  .get(async (req, res) => {
    console.log('into get route')
    try {
      const roomList = await roomData.getAllRooms();
      return res.json(roomList);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })
  .post(async (req, res) => {
    console.log('into post routeeeeeeee')
    const roomDataBody = req.body;
    //make sure there is something present in the req.body
    if (!roomDataBody || Object.keys(roomDataBody).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    //check all inputs, that should respond with a 400
    try {
        roomDataBody.title = validation.checkString(roomDataBody.title, 'Title');
        
    //     roomData.adminID = validation.checkId(
    //         roomData.adminID,
    //     'Admin ID'
    //   );
      
    } catch (e) {
        console.log(e)
        console.log('inside error block')
      return res.status(400).json({error: e});
    }

    //insert the room
    try {
      const {title, adminID, isPrivate} = roomDataBody;
      const newRoom = await roomData.addRoom(title,adminID,isPrivate)
      return res.json(newRoom);
    } catch (e) {
        console.log(e)
        console.log('error state being here')
      return res.status(500).json({error: e});
    }
  });

  router.route('/publicRooms').get(async (req, res) => {
    console.log('into get PUBLIC ROOMS route');
    try {
      const roomList = await roomData.getAllPublicRooms();
      return res.json(roomList);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });
  
router
  .route('/:id')
  .get(async (req, res) => {
    //check inputs that produce 400 status
    try {
    //   req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    //try getting the post by ID
    try {
      const room = await roomData.getRoomById(req.params.id)
      return res.json(room);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })


  
//   .put(async (req, res) => {
//     const updatedData = req.body;
//     //make sure there is something in the req.body
//     if (!updatedData || Object.keys(updatedData).length === 0) {
//       return res
//         .status(400)
//         .json({error: 'There are no fields in the request body'});
//     }
//     //check all the inputs that will return 400 if they fail
//     try {
//       req.params.id = validation.checkId(req.params.id, 'ID url param');
//       updatedData.title = validation.checkString(updatedData.title, 'Title');
//       updatedData.body = validation.checkString(updatedData.body, 'Body');
//       updatedData.posterId = validation.checkId(
//         updatedData.posterId,
//         'Poster ID'
//       );
//       if (updatedData.tags) {
//         if (!Array.isArray(updatedData.tags)) {
//           updatedData.tags = [];
//         } else {
//           updatedData.tags = validation.checkStringArray(
//             updatedData.tags,
//             'Tags'
//           );
//         }
//       }
//     } catch (e) {
//       return res.status(400).json({error: e});
//     }
//     //try to update the post
//     try {
//       const updatedPost = await postData.updatePostPut(
//         req.params.id,
//         updatedData
//       );
//       return res.json(updatedPost);
//     } catch (e) {
//       return res.status(404).json({error: e});
//     }
//   })
//   .patch(async (req, res) => {
//     const requestBody = req.body;
//     //check to make sure there is something in req.body
//     if (!requestBody || Object.keys(requestBody).length === 0) {
//       return res
//         .status(400)
//         .json({error: 'There are no fields in the request body'});
//     }
//     //check the inputs that will return 400 is fail
//     try {
//       req.params.id = validation.checkId(req.params.id, 'Post ID');
//       if (requestBody.title)
//         requestBody.title = validation.checkString(requestBody.title, 'Title');
//       if (requestBody.body)
//         requestBody.body = validation.checkString(requestBody.body, 'Body');
//       if (requestBody.posterId)
//         requestBody.posterId = validation.checkId(
//           requestBody.posterId,
//           'Poster ID'
//         );
//       if (requestBody.tags)
//         requestBody.tags = validation.checkStringArray(
//           requestBody.tags,
//           'Tags'
//         );
//     } catch (e) {
//       return res.status(400).json({error: e});
//     }
//     //try to perform update
//     try {
//       const updatedPost = await postData.updatePostPatch(
//         req.params.id,
//         requestBody
//       );
//       return res.json(updatedPost);
//     } catch (e) {
//       return res.status(404).json({error: e});
//     }
//   })
  .delete(async (req, res) => {
    //check the id
    try {
    //   req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    //try to delete post
    try {
      let deletedroom = await roomData.removeRoom(req.params.id)
      return res.json(deletedroom);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });

// router.route('/tag/:tag').get(async (req, res) => {
//   //check input
//   try {
//     req.params.tag = validation.checkString(req.params.tag, 'Tag');
//   } catch (e) {
//     return res.status(400).json({error: e});
//   }
//   //try to get all posts by tag
//   try {
//     const postList = await postData.getPostsByTag(req.params.tag);
//     return res.json(postList);
//   } catch (e) {
//     return res.status(404).json({error: e});
//   }
// });

// router.route('/tag/rename').patch(async (req, res) => {
//   //check req.body
//   if (!req.body || Object.keys(req.body).length === 0) {
//     return res
//       .status(400)
//       .json({error: 'There are no fields in the request body'});
//   }
//   //check input params
//   try {
//     req.body.oldTag = validation.checkString(req.body.oldTag, 'Old Tag');
//     req.body.newTag = validation.checkString(req.body.newTag, 'New Tag');
//   } catch (e) {
//     return res.status(400).json({error: e});
//   }

//   try {
//     let getNewTagPosts = await postData.renameTag(
//       req.body.oldTag,
//       req.body.newTag
//     );
//     return res.json(getNewTagPosts);
//   } catch (e) {
//     return res.status(404).json({error: e});
//   }
// });

export default router;