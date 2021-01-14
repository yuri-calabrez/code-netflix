<?php

namespace App\Auth;

use BadMethodCallException;
use Exception;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Support\Traits\Macroable;
use Tymon\JWTAuth\JWT;

class KeycloakGuard implements Guard
{
    use GuardHelpers, Macroable {
        __call as macroCall;
    }

    /**
     * @var JWT
     */
    private $jwt;
    /**
     * @var Request
     */
    private $request;

    public function __construct(JWT $jwt, Request $request)
    {
        $this->jwt = $jwt;
        $this->request = $request;
    }

    public function user()
    {
        if ($this->user !== null) {
            return $this->user;
        }

        if ($this->jwt->setRequest($this->request)->getToken() &&
            ($payload = $this->jwt->check(true)) &&
            $this->validateSubject()
        ) {
            return $this->user = $this->provider->retrieveById($payload['sub']);
        }
    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     *
     * @return bool
     */
    public function validate(array $credentials = [])
    {
        throw new Exception("Not implemented");
    }

    /**
     * Magically call the JWT instance.
     *
     * @param  string  $method
     * @param  array  $parameters
     *
     * @throws \BadMethodCallException
     *
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if (method_exists($this->jwt, $method)) {
            return call_user_func_array([$this->jwt, $method], $parameters);
        }

        if (static::hasMacro($method)) {
            return $this->macroCall($method, $parameters);
        }

        throw new BadMethodCallException("Method [$method] does not exist.");
    }
}