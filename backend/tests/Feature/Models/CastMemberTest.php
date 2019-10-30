<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();
        $this->assertCount(1, $castMembers);
        $castMemberKeys = array_keys($castMembers->first()->getAttributes());
        $this->assertEqualsCanonicalizing([
            'id',
            'name',
            'type',
            'created_at',
            'updated_at',
            'deleted_at'
        ], $castMemberKeys);
    }

    public function testCreate()
    {
        $castMember = CastMember::create([
            'name' => 'test1',
            'type' => 1
        ]);
        $castMember->refresh();

        $this->assertEquals('test1', $castMember->name);
        $isUuidValid = preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $castMember->id);
        $this->assertTrue((bool)$isUuidValid);

        $castMember = CastMember::create([
            'name' => 'test1',
            'type' => 2
        ]);
        $this->assertNotEquals(1, $castMember->type);
    }

    public function testUpdate()
    {
        $castMember = factory(CastMember::class)->create([
            'name' => 'test',
            'type' => 2
        ])->first();

        $data = [
            'name' => 'test_updated',
            'type' => 1
        ];
        $castMember->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    public function testDelete()
    {
        $castMember = factory(CastMember::class)->create()->first();
        $this->assertTrue($castMember->delete());
    }
}
