# Codex


__Readme in progress__

Database Schema
=================

root/userpages/$userpageId/{userpage}
-------------------------------------
Contains a UserPage's detailed data.

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
Contains a Node's detailed data.

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

root/user_nodes/$userId/$nodeId/true
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
```


root/user_userpages/$userId/$userpageId
---------------------------------------
All UserPages a User has access to.


root/userpage_nodes/$userpageId/$nodeId
---------------------------------------
All Nodes contained in a UserPage. 