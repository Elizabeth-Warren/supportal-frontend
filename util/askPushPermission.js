const askPushPermission = () =>
  new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => {
      resolve(result);
    });
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(permissionResult => {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
  });

export default askPushPermission;
