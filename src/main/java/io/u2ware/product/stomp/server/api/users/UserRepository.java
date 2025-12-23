package io.u2ware.product.stomp.server.api.users;

import io.u2ware.common.data.jpa.repository.RestfulJpaRepository;
import io.u2ware.product.stomp.server.domain.User;

public interface UserRepository extends RestfulJpaRepository<User,String>{

}
