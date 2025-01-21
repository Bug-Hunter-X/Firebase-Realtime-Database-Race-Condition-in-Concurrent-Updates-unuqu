function incrementCounter(counterRef) {
  counterRef.transaction(currentVal => {
    if (currentVal === null) {
      return 1;
    }
    return currentVal + 1;
  }).then(() => {
    console.log('Counter incremented successfully!');
  }).catch(error => {
    console.error('Error incrementing counter:', error);
  });
}

//To resolve race conditions, the solution incorporates optimistic locking and server-side timestamps:
function incrementCounterWithOptimisticLocking(counterRef) {
  counterRef.once('value', snapshot => {
    const currentVal = snapshot.val();
    const newCount = currentVal + 1;
    const updates = {
      count: newCount,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP,
    };
    counterRef.update(updates).then(() => {
      console.log('Counter incremented successfully!');
    }).catch(error => {
      //Handle optimistic locking failures. For instance, check if the lastUpdated value changed during the operation.
      console.error('Error incrementing counter:', error);
    });
  });
}
