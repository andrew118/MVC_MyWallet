<?php

namespace App\Models;

use PDO;

class cashFlow extends \Core\Model
{
    public static function assignDefaultCategoriesToUser($id)
    {
        $db = static::getDB();
        if ($db->query("INSERT INTO payment_methods_assigned_to_users (user_id, name) SELECT '$id', name FROM payment_methods_default")
            && $db->query("INSERT INTO expenses_category_assigned_to_users (user_id, name) SELECT '$id', name FROM expenses_category_default")
            && $db->query("INSERT INTO incomes_category_assigned_to_users (user_id, name) SELECT '$id', name FROM incomes_category_default")) {
            
            return true;
        }
        return false;
    }
}