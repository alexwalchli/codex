# Codex

Eventually your AI-powered personal wiki. 

https://codex-f90ff.firebaseapp.com

Database Schema
=================


root/userpages/$userpageId/{userpage}
-------------------------------------
Contains a UserPage's detailed data. Security access is through userPagesByUser.

**Security Rules**
```
"userPages": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userPageId": {
    // a root/userPagesByUser/$userId/$userpageId must exist prior to reading
    ".read": "root.child('user_userpages/' + auth.uid + '/' + $userPageId).exists()",
    // a root/userPagesByUser/$userId/$userpageId must exist prior to writing
    ".write": "root.child('user_userpages/' + auth.uid +  '/' + $userPageId).exists()",
  }
}
```

root/nodes/$nodeId/{node}
-------------------------
Contains a Node's detailed data. Security access is through userPagesByUser.

**Security Rules**
```
"nodes": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$nodeId": {
    // a root/user_nodes/$userId/$nodeId must exist prior to reading
    ".read": "root.child('userPagesByUser/' + data.child('userPageId').val() +  '/' + auth.uid).exists()",
    // a root/user_nodes/$userId/$nodeId must exist prior to writing
    ".write": "root.child('userPagesByUser/' + data.child('userPageId').val() +  '/' + auth.uid).exists()",
  }
}
```

root/userPagesByUser/$userId/$userpageId
---------------------------------------
All UserPages a User has access to. 

**Security Rules**
```
"userPagesByUser": {
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
      ".write": "$userId === auth.uid || root.child('userPagesByUser/' + auth.uid +  '/' + $userpageId).exists()",
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
"nodesByUserPage": {
  // must be authenticated
  ".read": "(auth != null)",
  ".write": "(auth != null)",
  "$userpageId": {
    // must have a userPagesByUser/$userId/$userPageId prior to reading
    ".read": "root.child('userPagesByUser/' + auth.uid +  '/' + $userpageId).exists()",
    ".write": "root.child('userPagesByUser/' + auth.uid +  '/' + $userpageId).exists()",
    "$nodeId": { }
  }
}
```