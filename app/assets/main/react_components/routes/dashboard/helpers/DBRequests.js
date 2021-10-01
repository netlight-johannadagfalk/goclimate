export const updateAccepted = (action, user, mounted, acceptAction) => {
  const actionID = action.id;
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const URL = '/user_climate_actions';
  const requestOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      climate_action_id: actionID,
      user_id: user.id,
      status: false
    })
  };

  fetch(URL, requestOptions)
    .then((res) => {
      if (mounted) {
        return res.json();
      }
    })
    .then((json) => acceptAction(action, json))
    .catch((e) => console.warn(e));
};

export const deleteUserAction = (id) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const URL = '/user_climate_actions/' + id.toString();
  const requestOptions = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    }
  };
  fetch(URL, requestOptions).catch((e) => console.warn(e));
};

export const updateStatus = (id, status, mounted) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const URL = '/user_climate_actions/' + id.toString();
  const requestOptions = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: status })
  };
  fetch(URL, requestOptions)
    .then((res) => {
      if (mounted) {
        return res.json();
      }
    })
    .catch((error) => console.warn(error));
};
