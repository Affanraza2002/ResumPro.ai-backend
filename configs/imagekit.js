import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({

  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,

  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,

});

export default imagekit;
