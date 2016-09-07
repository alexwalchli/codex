# Codex
### Simple & Smart note-taking

## Database Schema

*nodes/$nodeId
Collection of nodes and their non-user specific data. Used by all Users have have a node_users/$nodeId/$userId item.

*node_userPages_users/$nodeId/$userPageId/$userId
A collection of nodes that are contained in a userPage. Used to retrieve all userPages by a single node so we know what
userPage_users_nodes to delete or create when deleting or creating a node.

*userPage_users_nodes/$userPageId/$userId/$nodeId
A collection of all userPages, their userId, and all their nodes. Used when initializing state to determine which nodes to subscribe to
by the current userPage.

*nodeUsers/$nodeId/$userId
A flattened collection of nodes and all the users that have access to it. This index is used by the Firebase Security Rules to determine who
has access to read and write which nodes.
