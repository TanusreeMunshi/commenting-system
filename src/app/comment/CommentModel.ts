export class Comment {
    id: any;
    name: any;
    content: any;
    lastUpdated: Date;
    upvotes: any;
    downvotes: any;
    childrenIds: any[];
    parentId: any;
    constructor(id, name, content, upvotes, downvotes, parentId) {
      this.id = id;
      this.name = name;
      this.content = content;
      this.lastUpdated = new Date();
      this.childrenIds = [];
      this.parentId = parentId;
    }
    static toJSONString(comment) { // created JSON string to send/save on server
      return `{
        "id" : "${comment.id}",
        "name" : "${comment.name}",
        "content" : "${comment.content}",
        "lastUpdated": "${comment.lastUpdated}",
        "parentId": "${comment.parentId}",
        "childrenIds": "${JSON.stringify(comment.childrenIds)}"
      }`;
      }
  }