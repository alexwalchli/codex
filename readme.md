# Codex


__Readme in progress__

Database Schema
=================


root/userpages/$userpageId/{userpage}
-------------------------------------
Contains a UserPage's detailed data. Security access is through user_userpages.

**Security Rules**
```
"userPages": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userPageId": {
    // a root/user_userpages/$userId/$userpageId must exist prior to reading
    ".read": "root.child('user_userpages/' + auth.uid + '/' + $userPageId).exists()",
    // a root/user_userpages/$userId/$userpageId must exist prior to writing
    ".write": "root.child('user_userpages/' + auth.uid+  '/' + $userPageId).exists()",
  }
}
```

root/nodes/$nodeId/{node}
-------------------------
Contains a Node's detailed data. Security access is through node.userPageId -> user_userpages.

**Security Rules**
```
"nodes": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$nodeId": {
    // a root/user_nodes/$userId/$nodeId must exist prior to reading
    ".read": "root.child('user_nodes/' + auth.uid + '/' + $nodeId).exists()",
    // a root/user_nodes/$userId/$nodeId must exist prior to writing
    ".write": "root.child('user_nodes/' + auth.uid+  '/' + $nodeId).exists()",
  }
}
```

<!--root/user_nodes/$userId/$nodeId/true
------------------------------------
All Nodes a User has access to.

**Security Rules**
```
"user_nodes": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userId": {
    // write: must have access to root/userpage_nodes/$userpageId/$nodeId which in turn must have access to user_userPages and user_nodes
    // read: must be the current user to access user_nodes/$userId
    "$nodeId": {
      // a root/user_nodes/$userId/$nodeId must exist prior to reading
      ".read": "root.child('user_nodes/' + auth.uid + '/' + $nodeId).exists()",
      // a root/user_nodes/$userId/$nodeId must exist prior to writing
      ".write": "root.child('user_nodes/' + auth.uid+  '/' + $nodeId).exists()",
    }
  }
}
```-->


root/userPagesByUser/$userId/$userpageId
---------------------------------------
All UserPages a User has access to. 

**Security Rules**
```
"user_userpages": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userId": {
    // 
    "$userpageId": {
      // must be the current user to read
      ".read": "$userId === auth.uid",
      // If a user is sharing a userpage then the user must already have access to the the page
      // or the $userId is the current user
      ".write": "$userId === auth.uid || root.child('user_userpages/' + auth.uid +  '/' + $userpageId).exists()",
    }
  }
}
```

root/nodesByUserPage/$userpageId/$nodeId
---------------------------------------
All Nodes contained in a UserPage. Used simply for retrieving a list of node IDs to subscribe to and retrieve
when loading a userPage. Also subscribed to for Node creates and deletes.

**Security Rules**
```
"userpage_nodes": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userpageId": {
    // must have a user_userpages/$userId/$userPageId prior to reading
    ".read": "root.child('user_userpages/' + auth.uid +  '/' + $userpageId).exists()",
    ".write": "root.child('user_userpages/' + auth.uid +  '/' + $userpageId).exists()",
    "$nodeId": { }
  }
}
```