---
permalink: Solution-Git-Push-Always-Ask-Passphrase
comments_id: 2
---

### Solution for always asking passphrase when git push

##### Replace HTTPS with SSH way to do the transfer in the socket

##### Check transport protocol

```text
git remote -v
```

> this should be like:

```text
origin https://github.com/guilindev/testRepo.git (fetch)
origin https://github.com/guilindev/testRepo.git (push)
```

##### Reset to SSH

```text
git remote rm origin
git remote add origin git@github.com:username/repository.git
git push # may need reset head by using  git push --set-upstream origin master
```

##### Check transfer protocol again

```text
git remote -v
origin git@github.com:guilindev/testRepo.git (fetch)
origin git@github.com:guilindev/testRepo.git (push)
```

##### When git push again, it won't ask passphrase