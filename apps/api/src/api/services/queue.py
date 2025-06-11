from arq import create_pool
from arq.connections import ArqRedis, RedisSettings

from core.config import settings


class Queue:
    """
    Arq Redis Queue

    See https://threeofwands.com/the-inner-workings-of-arq/
    """

    _instance: "Queue | None" = None

    _pool: ArqRedis | None = None

    def __init__(self):
        raise RuntimeError("Call instance() instead")

    @property
    def pool(self) -> ArqRedis:
        if self._pool is None:
            raise ValueError("Redis pool not initialized")
        return self._pool

    @classmethod
    def instance(cls) -> "Queue":
        if cls._instance is None:
            print("Creating new instance")
            cls._instance = cls.__new__(cls)
        return cls._instance

    async def create_pool(self) -> "ArqRedis":
        self._pool = await create_pool(RedisSettings(host=settings.queue.HOST, port=settings.queue.PORT))
        return self._pool

    async def close_pool(self) -> None:
        await self._pool.aclose()  # type: ignore

    async def enqueue_job(self, job_id: str, *args, **kwargs) -> None:
        """
        Enqueue a job in the Redis queue
        Automatically adds the correlation_id to the job
        """
        if self._pool is None:
            raise ValueError("Redis pool not initialized")

        """
        Optional parameters for `enque_job`:

        _queue_name - the name of a Redis sorted set to use as the job queue. You need to use this if you
            have several different services using the same Redis instance. Defaults to arq:queue.
        _defer_until, _defer_by - used to schedule jobs for later. If omitted, the job will be executed ASAP.
        _expires - skip executing the job if it hasn't run in this many seconds.
        _job_try - manually specify the job try. Job try is a variable Arq uses to track how many times
            the job has been (re-)run.
        """
        await self._pool.enqueue_job(
            job_id,
            *args,
            **kwargs,
        )
