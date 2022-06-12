export default () => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let count = 0;
  let randomId = '';

  while (count < 15) {
    randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
    count += 1;
  }

  return randomId;
};
