export const getUserCartItems = (cartItem: any) => {
  return JSON.parse(cartItem) || []
}
