import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin } from '../store/slices/authSlice';

/**
 * Custom hook for auth state access.
 */
const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  return { user, isAuthenticated, isAdmin };
};

export default useAuth;
