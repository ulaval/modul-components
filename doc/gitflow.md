modul-components is following the [Git branching model](https://nvie.com/posts/a-successful-git-branching-model/).

## Release steps

### Release branch

- Create a release branch
- Execute the following scripts
```
    npm run reset // resets the node_modules folder
    npm run setup // npm install
    npm version --no-git-tag-version prerelease
```
- Commit and push the release branch

### Merge in master
- Execute the following git commands
```
git checkout master

git merge --no-ff <release-branch>
// merge conflicts to resolve for version change
// unless there are changes in dependencies, scripts, etc., only the version should be different in package.json and package-lock.json
git push

// optional
npm pack // this will ensure that everything is fine before tagging
// end-optional
git tag -s v1.0.0-beta.xx -m 'Release 1.0.0-beta.xx'  // since it's still a prerelease
git push origin v1.0.0-beta.xx

npm publish
```

### Merge back the release branch into develop (pull request needed)

### Post-publishing stuff
- Close Github milestone and open a new one
- Release Jira version, ensure all tickets are closed, open a new version
- Publish release notes if needed
