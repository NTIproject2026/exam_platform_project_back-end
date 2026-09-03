import mailEnum from "../../enum/mail.enum.js";
import { eventEmitter } from "./email.event.js";
import { sendMail } from "./nodeMailer.js";
import redisServices from "../services/redis.services.js";

import cacheKeyEnum from "../../enum/redis.base.enum.js";
import { ForbiddenException } from "../../errors/message.error.js";
import { GlobalHash } from "../../utils/security/hash.js";

export const sendEmail = async ({
  to,
  subject,
  data,
}: {
  to: string;
  subject: string;
  data: any;
}) => {
  let [blockedUser, attempts] = await Promise.all([
    redisServices.getKeyTtl(
      redisServices.cacheKey({
        filter: to,
        subject: cacheKeyEnum.block,
      }),
    ),
    redisServices.getKey({
      key: redisServices.cacheKey({
        filter: to,
        subject: cacheKeyEnum.emailAttempts,
      }),
    }),
  ]);
  if (blockedUser && blockedUser > 0)
    ForbiddenException(`you are being blocked please wait for ${blockedUser}`);

  if (!attempts) {
    attempts = (await redisServices.setKey({
      key: redisServices.cacheKey({
        filter: to,
        subject: cacheKeyEnum.emailAttempts,
      }),
      value: 0,
      ttl: 6 * 10,
    })) as string;
  }

  // incr attempts email
  await redisServices.incrKey(
    redisServices.cacheKey({
      filter: to,
      subject: cacheKeyEnum.emailAttempts,
    }),
  );

  // check attempts number
  if (Number(attempts) + 1 > 5) {
    await redisServices
      .setKey({
        key: redisServices.cacheKey({
          filter: to,
          subject: cacheKeyEnum.block,
        }),
        value: 1,
        ttl: 60 * 10,
      })
      .then(() => {
        return ForbiddenException("you are being blocked for 10min");
      });
  }

  eventEmitter.emit(mailEnum.sendMail, async () => {
    await Promise.all([
      redisServices.setKey({
        key: redisServices.cacheKey({ filter: to, subject }),
        value: GlobalHash( `${data}` ),
        ttl: 60 * 5,
      }),
      sendMail({
        to,
        subject,
        data,
      }),
    ]);
  });
};
