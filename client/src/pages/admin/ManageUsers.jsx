import { useGetAllUsersQuery } from '../../api/userApi';
import styles from '../../styles/pages/ManageUsers.module.css';

const ManageUsers = () => {
  const { data, isLoading } = useGetAllUsersQuery();
  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;

  if (isLoading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={styles.usersPage}>
      <h1>Manage Users</h1>
      <p className={styles.summary}>
        Total <span className={styles.summaryCount}>{total}</span> registered users
      </p>

      {users.length === 0 ? (
        <div className={styles.empty}>No users found.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={styles.userName}>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.userEmail}>{user.email}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={styles.date}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
