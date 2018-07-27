modul-components is following the [Git branching model](https://nvie.com/posts/a-successful-git-branching-model/).

## Release steps

### Pull request approval
Once approved, do the following steps for each PR
- Merge into `develop` using a squash merge (only one commit for a complete feature)
- Delete the feature branch
- Assign the current opened milestone to the PR
- Resolve the linked Jira ticket and assign the current opened version

### Release branch
> These steps can be performed manually or using the Jenkins task `MODUL/modul - releases/modul - creer-branche-release`
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
// unless there are changes in dependencies, scripts, etc., only the version should be different in the package.json and package-lock.json files.
git push

// optional
npm pack // this will ensure that everything is fine before tagging
// end-optional
```

> The following steps can be performed manually or using the Jenkins task `MODUL/modul - releases/modul - tag-publish-master`
```
git tag -s v1.0.0-beta.xx -m 'Release 1.0.0-beta.xx'  // since it's still a prerelease
git push origin v1.0.0-beta.xx

npm publish
```

### Merge back the release branch into develop (pull request needed)
Merging is a bit different
- You don't need to assign a milestone to this PR though
- Use a merge commit, not a squash merge

### Post-publishing stuff
- Close Github milestone and open a new one
- Publish release notes if needed
- Release Jira version, ensure all tickets are closed, open a new version
- Link the Guthub release notes to the Jira release
