import axios from "axios";
import jwt_decode from "jwt-decode";

// axios.defaults.baseURL = "http://localhost:8080";

/** Make API Requests */

/** To get username from Token */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token);
  return decode;
}

/** authenticate function */
export async function authenticate(username) {
  try {
    let resp = await axios.post("http://localhost:8080/api/authenticate", {
      username,
    });
    return resp;
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

/** get User details */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/user/${username}`
    );
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match...!" };
  }
}

export async function getTask() {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/tasks`);
    console.log(" data ==> helper", data);
    return { data };
  } catch (err) {
    return { err: "No datafound" };
  }
}

export async function getToggletask() {
  try {
    console.log(" helper toggle");
    const { data } = await axios.get(`http://localhost:8080/api/tasks`);

    return { data };
  } catch (err) {
    return { err: "No datafound" };
  }
}

export async function pushNotification(subscription) {
  try {
    console.log(" notification helper ");
    await axios.post(`http://localhost:8080/api/subscribe`, {
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(" err", err);
  }
}

export async function deleteTasks(id, token) {
  try {
    console.log(" helper delete", id);
    const { data } = await axios.delete(
      `http://localhost:8080/api/tasks/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { data };
  } catch (err) {
    return { err: "No datafound" };
  }
}
//updateStatus

export async function updateStatus(task, token) {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/tasks/completed/${task._id}`,
      {
        done: !task.done,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(" data ===> ", data);
    return { data };
  } catch (err) {
    return { err: "No datafound" };
  }
}

export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`http://localhost:8080/api/register`, credentials);

    let { username, email } = credentials;

    /** send email */
    if (status === 201) {
      console.log(" msg ", msg);
      let res = await axios.post("http://localhost:8080/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
      console.log("Res ", res);
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** login function */
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

/** update user profile function */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(
      "http://localhost:8080/api/updateuser",
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

/** generate OTP */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("http://localhost:8080/api/generateOTP", {
      params: { username },
    });

    // send mail with the OTP
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("http://localhost:8080/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get(
      "http://localhost:8080/api/verifyOTP",
      {
        params: { username, code },
      }
    );
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

/** reset password */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put(
      "http://localhost:8080/api/resetPassword",
      {
        username,
        password,
      }
    );
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
