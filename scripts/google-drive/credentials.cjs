const dotenv = require('dotenv-safe')
const crypto = require('crypto');
dotenv.config()

const {ENCRYPTION_KEY, ENCRYPTION_IV, ENCRYPTION_ALGO} = process.env;

function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(ENCRYPTION_ALGO, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

const hw = {
  iv: ENCRYPTION_IV,
  encryptedData: 'b9b621e3ad032484e5b7b2a5c23ea953aa1a46138509e6cf3f354c7b4f2d51ca85402c1697cd09b3d76d6655640013ed107467d567c962aeb71469aca9213c6b103ff3f61cf8bd0edaed530f046e9b08ea111d6d7677b7d0fdf31ca7c13de79beb0d9e16b6b425876ad9c214bf43c19fa1b5d6c11b49336ab6bfa36596650e3661022eeadf3549aff3e58967664b3b4e3d639b5178c057f2647e79827a195b88b7e36a0887e116a7b3cf7ca9bf4f0693dade8b180206d553c3ee6a73838b29476c4df4c69830d77f3e3c1db0f697325c83aa44cfbcf38492f612cd36355f15f51bc490eaf3ca4371dad07d56b5cd66184694b2d6c983c69b65131cf745ab463f8aa1db9c792e7ed18c0b5b8c42d2c12ef1d01011f23729aa7cc88ad16e7c8aa0773902d4e02ee6f17f46d602a1fe844cbbd420f526dc58925e59759f99b801155de9b3572d62a8d91320f421c6c5653932fc92f69b7f22fa3b1131b380ca977cf22610be77d484b24594727a2b43db6449437a44bebb47b07455afedc69dae699ee498c236d85424f76f1a1189ca854f3c97d2c95871db95b4c888f1c3bbdc699d986d6c50e8216a2309f81a07fdf809f74771f253e9717a16aee0a592e3b39abfa094132d29e5a7fdb4a9d1583ce06641087577a6b11b4560882d0b0d0369485b0191d0a84c5303bc1ba87114b5d5b51faf9dc08e5ec791c3470437f818cdc538d4835d36125e47fa3f8f9ff1b3da537f16f0a4a947f2ab77fa3dc4bb9c5a369ab2b1a307e90900dd5155d412ebf68d1e00973420f9bb28045cba9bbde939b7781344337bd098366b95bc57fec9cc6c057c0171665d74ad3610061729496f3ae5c6c0b0363a199cf6112d505aa4ee20baa07285d50a0114b90aae406aafa3beef938eeb5703a5350ed7e116e2c8541ec5baa0dac7f4ab2710ba8b75ac5b8c7fc7030ca9273ed57156a14c802e46518b6b2bb21c3d06d131f599d8f49cc0bde3f8734ce5df50895b18adc2f25dc7f19b7c848ada9ee22e0dd1c424da3c2d714280fc6c096ac556a8ccfba5b06b6d6abfe33d2370a69c5b0d3d230391283f0ac7f5e8dd0706fac7d4f46807f42fbc7701fcf15dc383e90c0d569b3b77a17c429b1bcb5c24a337ce83564a6f7f635942bd83cbab876b8fc9015011457d9d3b89c4d89c9b10f2edeed64bd76b8b8339293c1f59e292be42bf90257ed17efc8b1c2a1e6f93c76da5ea93ea39181446cfeeae1f4e8bebff130be2577a25935c5c0131032d33ee740379c326d252846a2a7ec94c2035f2094557bcf9767cfc547dc9e481fcf5122a013d73f612c316ed0e3060fd137a57b1b7c41eef12b52deca06d32df65cb270762c7b570e196711b92bc25dcfd6452bdad92c130659210b45d67335fc4459f0b82c7aac7e9f7e074c14726a0139e2bfecbcd1f9629d78cedee2b9900317102a4486654e062eeb4d1fc88d8620440b063dca2090645ad63040be9e83764087803e10929682b0f770b1df771d16e593d27c5fe9897c9113a523bd8765ddff721d405a6ff667125b040feffb2e26291f86e73457091cc51087f8d1f6bba86256e83e5f18315a654e53d62ba012df8f82f337fed0f35046a00913387fbaf0531cba86c4d34170a96b58129a15f88d34d9df8b8f341a237c1f13e6932796e120b03869c29f80ed2047db3afe6b9ca927ef7184f073ce382989d26237ee408e321e69872443d0567d66afeaf83dfbff7f9c95e85d1be2e368c2d5ebd194d1d06ef3c65f1a076922889d35311723cec23cd6c55505903e55688511b229aea530fbe48da533bfab9166b96d0605219449bdb439f79c436f04a8a83687b1343876add472a63e42701592863495c1d91e0cabb5a7b822ca383479bb44479737f1c8b65e2a79937843e9c7634a483191f7639c400f553bab841614b27cbf402de73869272fe5da8d8dede95af37b943e1fee0b4f49604922ee87d5b7f14e84d054a68c094627ff445e7f051d413ee0f6ef475ab90f16311af0b4fb5c807f9dff306f51ade2b9a4891d5175f8352725ed27214662928096f31623d16279f7f58309d1c49b97c3e1cca6b56a99422dc6c882cc2e32901250fc0dc23bf99cdbd037899ba653e3d77b981cf0f5a32799d8a81024eee81935e2ed1d029491fb7857a7beb73e45f5bd75878da2dd0d84d020bbf0dfbeeb3d48bb6c34174683a0f20ba7b6809237de6274069b6789628c82c157420216dbaf51bd8ed46ecb912b25a64adea2ca95be90ba22ae40878aa678c166bbc2d2bd23a9fa2438c8650c5a4eb2aa1b82d81482062696ab7d45b6c6ddf3bd4b1c1d8fc19605f8bc512feaace4579f9b975b96145265bd3ebe37b78016951386673ef942979351c7f1f650a5f411b58b657392fd149b741242cf59533c79483ac56a549377891640dd7f89e7527cc4b5dab6871424fcce316ef3efd2d4dcdd09a23b418b7dec90abce2efcfc105ec96f08811e5f06dd53ce171f3ccbacfe596fa06d84cc357a1b65448db410b68a093216ad8ea1f0b0b9060752b9569c8821a303d9ee7211c8bdcb7ca1dbef3b9970b46839585e24435be4dc49b2bef7c0401a04a4252797c612f57afc8065f5bf18909862aa270641cc00d415bcda7e8c1c22aa9ad7c4917335942ac90e5dc2b4ca94bf63d0e502fffd100499f6febf0bf48182f807aa641dc12a1b2c712f80882eb8abad12d13d25e7cdfe4266228bac4d36c40dba9283bc1ce04147838292d44c8c5ff762011d04f93abdc160b7dbea227483d328bdadc85955256beb737210fd14065d6a39c74362fbaf97a5aab938344cc526f30c3ba7314df2dc189450fc3b656d04ec923a5a85b02dc2f96b68bc394c6e0fe7f45178d71d7e5799e7530512c5c514a955756c8728b350c64c51e350d0750aa6b829151f4d1a6153fa07cbd702a78ee25ee2d9eb2ee95e3a88db1a7432974f54ec84878cacd84bbe85e480620e6a18111c630ff5264ba18947634d9bb82e0e22537a633fb125eedc3c1b6730cf214a3922558de4a88c28121701581ac1a9c33fbb2881f268846d062e4f262efa863fd1b2652cb7c0c5b9a6a94fb57c9cd47ed5ac9a054f3cb607a7f21367ee800a9d3804a6111ee07ab83081a47512171c344a50976518e07e3e2248dd30f43bb7f6ee0d424b803751e29304109f7f2a8386ede726b1f00d391ffc8788a7f1f'
}

module.exports = () => new Promise((resolve) => resolve(JSON.parse(decrypt(hw))))