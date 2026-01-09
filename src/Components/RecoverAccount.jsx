const Recover_Account = () => {
    return (
        <>
            <div className="recoverAccount_wrapper">
                <form action="" className="access_login_form">
                            <div className="form-group-access">
                                <label htmlFor="username" className="form-label-access">Username or Email</label>
                                <input type="text" id="username" className="form-control-access" />
                            </div>

                            <div className="form-group-access">
                                <label htmlFor="password" className="form-label-access">Password</label>
                                <input type="password" id="password" className="form-control-access" />
                            </div>

                            <button type="button" className="btn-login-access" onClick={handleLogin}>Login</button>
                </form>
            </div>
        </>
    )
}

export default Recover_Account;