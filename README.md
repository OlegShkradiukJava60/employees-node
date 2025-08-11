# HW# 10 AAA
## Complete AAA solution (The simplest solution )
### Introduce middleware function auth (woring out the function parameter and usage )
#### This middleware has to make decision out of the following options
1. 401 code if either no token or invalid token <br>
2. 403 code if role mismatches route functionality <br>
3. continuation of request pipeline processing
### Appropriate Updating index.ts
### Appropriate Updating errors handler
### There should be following AAA rules
1. Getting employees  - authentication is required, may be performed for either ADMIN or USER <br>
2. Adding, updating, deleting employees - authentication is required, may be performed for only ADMIN
3. login - authentication isn't required
