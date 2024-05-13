# User Permissions
## Overview
These are permissions that each role grants, determined by the corresponding flag. 

### isBanned
- **Description**: This permission is granted to users who are banned from the site.
- They can not interact with the site outside of the ban page and publicly viewable pages.

### isRestricted
- **Description**: This permission is granted to users who are restricted from the site.
- They can not post or upload on the site, but can still view publicly viewable pages.

### isVerified
- **Description**: This permission is granted to users who have verified that they are who they say they are.
- They can post and upload on the site.

### staff/moderator
- **Description**: This permission is granted to users who moderate the site.
- They can post and upload on the site, and:
    - Delete posts and uploads.
    - Ban users.
    - Restrict users.
    - Verify users.
    - Verify posts and uploads.
    - View all user reports.
    - View all posts and uploads.

### staff/admin
- **Description**: This permission is granted to users who administrate the site.
- They can post and upload on the site, and:
    - Same as moderators.
    - Access the system panel
    - Promote/demote users to moderator.
    
### staff/super
- **Description**: This permission is granted to the site owner.
- **THIS IS A VERY DANGEROUS ROLE TO GRANT**
- They can post and upload on the site, and:
    - Same as admins.
    - Force change posts and uploads.
    - Force change users.
    - Act on behalf of users. (not log in, and will still show as the user)