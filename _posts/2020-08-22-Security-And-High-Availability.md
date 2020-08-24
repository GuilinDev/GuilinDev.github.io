---
permalink: Security-And-High-Availability
---

### 导致系统不可用的原因有哪些？保障系统稳定高可用的方案有哪些？请分别列举并简述。
高度可用的数据意味着几乎可以无中断访问的数据。通常用9的个数来衡量，影响高可用的因素包括：

* 服务器故障 - 服务器故障时可以将服务转移到冗余的主机服务器或者自动将故障转移到备用服务器；
* 存储介质故障 - 硬盘的使用寿命有限，解决办法是够见分布在多个主机服务器上的冗余存储；
* 网络延迟或中断 - 内部网络应该有多个交换机和路由器，考虑多个互联网连接，同样是冗余和备份的做法；
* 数据质量和不兼容的问题 - 不用类型的平台或环境与另一种不兼容，比如大型机系统和Hadoop，解决办法是建立数据存储体系和管道，使数据一致； 

### 用熟悉的编程语言写一个用户密码验证函数，Boolean checkPW（String 用户 ID，String 密码明文，String 密码密文）返回密码是否正确 boolean 值，密码加密算法使用你认为合适的加密算法。

```java
class EncryptFunc {

    /**
     * MD5简单加密
     * @param content 加密内容
     * @return String
     */
    private String md5Encrypt(final String content) {
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            BigInteger digest = new BigInteger(md5.digest(content.getBytes()));
            return digest.toString(16);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * SHA加密
     * @param content 待加密内容
     * @return String
     */
    private String shaEncrypt(final String content) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA");
            byte[] shaByte = sha.digest(content.getBytes());
            StringBuilder hexValue = new StringBuilder();
            for (byte byt : shaByte) {
                //将其中的每个字节转成十六进制字符串：byte类型的数据最高位是符号位，通过和0xff进行与操作，转换为int类型的正整数。
                String toHexString = Integer.toHexString(byt & 0xff);
                hexValue.append(toHexString.length() == 1 ? "0" + toHexString : toHexString);
            }
            return hexValue.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     *  用户密码验证函数，传入用户ID，用户输入的密码和加密后的密码
     * @param userId 用户id
     * @param password 用户密码明文
     * @param encryptedPassword 用户密码密文
     * @return Boolean
     */
    public Boolean checkPassword(String userId, String password, String encryptedPassword) {
        if (StringUtils.isEmpty(userId) || StringUtils.isEmpty(password)
                || StringUtils.isEmpty(encryptedPassword)) {
            return Boolean.FALSE;
        }
        // 1.先用MD5分别加密userId和password
        String md5UserId = md5Encrypt(userId);
        String md5Password = md5Encrypt(password);

        // 2.再将userId和password加密后的串形成新密码明文
        String newPassword = md5UserId + md5Password;

        // 3.将新密码明文再通过SHA加密成密文
        String newEncryptedPassword = shaEncrypt(newPassword);

        // 4.比较传入的密文和生成的密文是否相同
        if (encryptedPassword.equals(newEncryptedPassword)) {
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }
}
```
