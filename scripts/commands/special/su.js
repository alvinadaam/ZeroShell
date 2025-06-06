import { formatError, escapeHTML } from '../../tools/utils.js';
import { showInputModal } from '../../ui/inputModal.js';

const su = async function(args, shellState, vfsManager) {
  const role = args[0];
  if (!role) return formatError("su: missing user role (admin/user/all)");
  if (!["admin", "user", "all"].includes(role)) {
    return formatError(`su: invalid user role '${escapeHTML(role)}'`);
  }
  const password = await showInputModal({ prompt: "Password:", password: true, mode: "modal" });
  // Dummy password check for illustration; replace with real authentication
  if (password === "admin123") {
    shellState.user = "admin";
    return "Switched to admin.";
  } else {
    return "Authentication failed.";
  }
};

export default su;
