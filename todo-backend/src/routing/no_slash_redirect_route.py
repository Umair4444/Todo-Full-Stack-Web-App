from fastapi import FastAPI
from starlette.routing import Route, Match
from typing import List


class NoSlashRedirectRoute(Route):
    """
    Custom route class that prevents automatic redirects from /path to /path/
    """
    def matches(self, scope):
        path = scope.get("path", "")
        route_path = self.path

        # Check if the path matches with or without trailing slash
        match_with_slash = path == route_path
        match_without_slash = path == route_path.rstrip("/") and route_path.endswith("/")
        
        if match_with_slash or match_without_slash:
            # Add path parameters if any
            match = self.path_regex.match(path)
            if match:
                scope["path_params"] = dict(match.groupdict())
                return Match.FULL, scope
            elif path == route_path.rstrip("/"):
                # If path matches without trailing slash, still match
                stripped_path = path + "/"
                match = self.path_regex.match(stripped_path)
                if match:
                    scope["path_params"] = dict(match.groupdict())
                    return Match.FULL, scope

        return Match.NONE, {}