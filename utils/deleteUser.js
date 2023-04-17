/**
 * @param {Object} client - The client object
 * @param {string} newUserId - The ID of the user to delete
 * @description Deletes a user from the database
 */
export const deleteUser = async ({ client, newUserId }) => {
  try {
    await client.delete(newUserId).commit();
  } catch {}
};
